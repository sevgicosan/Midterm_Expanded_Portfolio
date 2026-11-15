// ============================================================
// JSON storage for blog posts.
//
// Every published post is APPENDED to data/blogs.json, so
// previous posts are never deleted or overwritten. The file
// (and its folder) is created automatically on first publish.
//
// Each post looks like:
// {
//   "id": "a1b2c3…",
//   "slug": "my-first-post",
//   "title": "My First Post",
//   "content": "Full text of the post…",
//   "image": "https://… or /uploads/…",
//   "publishedAt": "2026-11-10T…"
// }
// "image" is optional: either a web URL or the path of a file
// uploaded through the admin form (saved into public/uploads).
// ============================================================

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const dataDirectory = path.join(process.cwd(), "data");
const blogsFilePath = path.join(dataDirectory, "blogs.json");

export async function getBlogs() {
  try {
    const fileContents = await fs.readFile(blogsFilePath, "utf8");
    const parsed = JSON.parse(fileContents);

    // Only keep going if the file contains an array of posts.
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // File does not exist yet (or is unreadable) — no posts.
  }

  return [];
}

export async function getBlogBySlug(slug) {
  const blogs = await getBlogs();
  return blogs.find((blog) => blog.slug === slug) ?? null;
}

// Turns a title into a URL-safe slug, e.g. "My First Post!"
// becomes "my-first-post". If another post already uses that
// slug, a number suffix is added: "my-first-post-2".
function buildUniqueSlug(title, existingSlugs) {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "post";

  if (!existingSlugs.includes(base)) {
    return base;
  }

  let counter = 2;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter += 1;
  }
  return `${base}-${counter}`;
}

// Updates an existing post (found by its slug). Only the given
// fields change:
//   - image undefined → keep the current image
//   - image null      → remove the current image
//   - image string    → replace the image
// The slug itself never changes, so links to the post keep
// working after an edit. Returns the updated post, or null if
// the slug does not exist.
export async function updateBlogPost(slug, { title, content, image }) {
  const blogs = await getBlogs();
  const index = blogs.findIndex((blog) => blog.slug === slug);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...blogs[index],
    title: title.trim(),
    content: content.trim(),
  };

  if (image === null) {
    delete updated.image;
  } else if (typeof image === "string" && image.trim()) {
    updated.image = image.trim();
  }

  blogs[index] = updated;

  await fs.writeFile(blogsFilePath, JSON.stringify(blogs, null, 2), "utf8");

  return updated;
}

// Removes an uploaded image file that is no longer used by any
// post (used during edits, when an image is replaced or
// removed). Silently ignores anything outside public/uploads.
export async function deleteOrphanedUpload(imagePath, allPosts) {
  if (typeof imagePath !== "string" || !imagePath.startsWith("/uploads/")) {
    return;
  }

  const stillUsed = allPosts.some((post) => post.image === imagePath);
  if (stillUsed) {
    return;
  }

  try {
    await fs.unlink(path.join(process.cwd(), "public", imagePath));
  } catch {
    // Already gone — nothing to do.
  }
}

// Deletes a post by its slug. Returns the deleted post (so the
// caller can clean up its uploaded image), or null if the slug
// does not exist.
export async function deleteBlogPost(slug) {
  const blogs = await getBlogs();
  const index = blogs.findIndex((blog) => blog.slug === slug);

  if (index === -1) {
    return null;
  }

  const [deleted] = blogs.splice(index, 1);

  await fs.writeFile(blogsFilePath, JSON.stringify(blogs, null, 2), "utf8");

  return deleted;
}

export async function saveBlogPost({ title, content, image }) {
  const blogs = await getBlogs();
  const existingSlugs = blogs.map((blog) => blog.slug);

  const post = {
    id: randomUUID(),
    slug: buildUniqueSlug(title.trim(), existingSlugs),
    title: title.trim(),
    content: content.trim(),
    publishedAt: new Date().toISOString(),
  };

  // Optional cover image — a web URL or an uploaded file path.
  if (typeof image === "string" && image.trim()) {
    post.image = image.trim();
  }

  blogs.push(post);

  // Make sure the data folder exists, then write the full list back.
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(
    blogsFilePath,
    JSON.stringify(blogs, null, 2),
    "utf8"
  );

  return post;
}
