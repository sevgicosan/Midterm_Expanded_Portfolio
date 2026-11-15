// ============================================================
// API route for a single blog post.
//
//   PUT /api/blogs/[slug] → update an existing post
//   DELETE /api/blogs/[slug] → delete the post (and its unused
//     uploaded image)
//     multipart/form-data: title, content,
//     removeImage ("true"/"false"), and an optional new
//     uploaded image file (replaces the current one)
//
// The slug never changes on edit, so existing links to the
// post keep working. Text-only edits can omit the file.
// ============================================================

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { validateBlogPost } from "@/lib/blogValidation";
import {
  getBlogs,
  updateBlogPost,
  deleteBlogPost,
  deleteOrphanedUpload,
} from "@/lib/blogsStore";

const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

async function saveUploadedImage(file) {
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    throw new Error("UNSUPPORTED_TYPE");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("TOO_LARGE");
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];
  const fileName = `${randomUUID()}${extension}`;
  const fileContents = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(uploadsDirectory, { recursive: true });
  await fs.writeFile(path.join(uploadsDirectory, fileName), fileContents);

  return `/uploads/${fileName}`;
}

export async function PUT(request, { params }) {
  const { slug } = await params;

  // 1. Read the multipart body.
  let title = "";
  let content = "";
  let removeImage = false;
  let uploadedFile = null;

  try {
    const form = await request.formData();
    title = String(form.get("title") ?? "");
    content = String(form.get("content") ?? "");
    removeImage = String(form.get("removeImage") ?? "") === "true";

    const file = form.get("imageFile");
    if (file && typeof file === "object" && "arrayBuffer" in file && file.size > 0) {
      uploadedFile = file;
    }
  } catch {
    return NextResponse.json(
      { success: false, errors: {}, message: "Request body could not be read." },
      { status: 400 }
    );
  }

  // 2. Validate on the server (never trust the browser).
  const errors = validateBlogPost({ title, content });

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        success: false,
        errors,
        message: "Please fix the errors below and try again.",
      },
      { status: 400 }
    );
  }

  // 3. Save a replacement image, if one was uploaded.
  let newImage; // undefined = keep current, null = remove, string = replace
  let imagePath = "";
  if (uploadedFile) {
    try {
      imagePath = await saveUploadedImage(uploadedFile);
      newImage = imagePath;
    } catch (error) {
      const message =
        error.message === "UNSUPPORTED_TYPE"
          ? "Unsupported image type — please use JPG, PNG, WebP, or GIF."
          : error.message === "TOO_LARGE"
            ? "The image is too large — please use a file under 5 MB."
            : "The image could not be saved. Please try again.";

      return NextResponse.json(
        { success: false, errors: { image: message }, message },
        { status: 400 }
      );
    }
  } else if (removeImage) {
    newImage = null;
  }

  // 4. Apply the update.
  let oldPost = null;
  let post;
  try {
    const blogs = await getBlogs();
    oldPost = blogs.find((blog) => blog.slug === slug) ?? null;
    post = await updateBlogPost(slug, { title, content, image: newImage });
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Something went wrong while saving the post. Please try again.",
      },
      { status: 500 }
    );
  }

  if (!post) {
    return NextResponse.json(
      { success: false, errors: {}, message: "This blog post does not exist." },
      { status: 404 }
    );
  }

  // 5. If the old uploaded image is now unused, remove its file.
  try {
    if (oldPost && oldPost.image && oldPost.image !== post.image) {
      await deleteOrphanedUpload(oldPost.image, await getBlogs());
    }
  } catch {
    // Cleanup is best-effort; never fail the update over it.
  }

  return NextResponse.json({ success: true, message: "Blog post updated.", post });
}

export async function DELETE(request, { params }) {
  const { slug } = await params;

  let deleted;
  try {
    deleted = await deleteBlogPost(slug);
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting the post. Please try again.",
      },
      { status: 500 }
    );
  }

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "This blog post does not exist." },
      { status: 404 }
    );
  }

  // The post is gone — remove its uploaded image too, unless
  // another post still uses the same file.
  try {
    if (deleted.image) {
      await deleteOrphanedUpload(deleted.image, await getBlogs());
    }
  } catch {
    // Cleanup is best-effort; never fail the delete over it.
  }

  return NextResponse.json({ success: true, message: "Blog post deleted." });
}
