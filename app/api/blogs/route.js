// ============================================================
// API routes for blog posts.
//
//   GET  /api/blogs   → list of all published posts (newest first)
//   POST /api/blogs   → publish a new post { title, content }
//
// The POST body is multipart/form-data:
//   title, content, and an optional uploaded image file
//   (saved to public/uploads and served by the site)
//
// Used by the admin page (POST + GET) and the public blog list
// (GET). All data lives in data/blogs.json via lib/blogsStore.
// ============================================================

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { validateBlogPost } from "@/lib/blogValidation";
import { getBlogs, saveBlogPost } from "@/lib/blogsStore";

const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

// Saves an uploaded image into public/uploads and returns the
// public path ("/uploads/<name>") that browsers can open.
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

export async function GET() {
  const blogs = await getBlogs();

  // Newest posts first.
  const posts = [...blogs].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  return NextResponse.json({ success: true, posts });
}

export async function POST(request) {
  // 1. Accept both JSON and multipart (file upload) bodies.
  const contentType = request.headers.get("content-type") ?? "";
  let title = "";
  let content = "";
  let uploadedFile = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      title = String(form.get("title") ?? "");
      content = String(form.get("content") ?? "");

      const file = form.get("imageFile");
      if (file && typeof file === "object" && "arrayBuffer" in file && file.size > 0) {
        uploadedFile = file;
      }
    } else {
      const body = await request.json();
      title = typeof body.title === "string" ? body.title : "";
      content = typeof body.content === "string" ? body.content : "";
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Request body could not be read.",
      },
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

  // 3. If an image file was uploaded, store it in public/uploads.
  let imagePath = "";
  if (uploadedFile) {
    try {
      imagePath = await saveUploadedImage(uploadedFile);
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
  }

  // 4. Append the post to data/blogs.json.
  let post;
  try {
    post = await saveBlogPost({
      title,
      content,
      image: imagePath,
    });
  } catch (error) {
    console.error("Failed to save blog post:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Something went wrong while saving the post. Please try again.",
      },
      { status: 500 }
    );
  }

  // 5. Tell the client it worked (and hand back the created post).
  return NextResponse.json(
    {
      success: true,
      message: "Blog post published.",
      post,
    },
    { status: 201 }
  );
}
