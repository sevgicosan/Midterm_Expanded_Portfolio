"use client";

// ============================================================
// Blog admin UI (client component).
//
// Two jobs:
//   1. Publish a new post: sends { title, content } (+ optional
//      cover image) to POST /api/blogs.
//   2. Manage: lists the published posts with Edit buttons.
//      Editing loads a post into the same form and saves
//      through PUT /api/blogs/[slug] (the slug never changes).
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionNavRow from "@/components/SectionNavRow";
import formStyles from "@/app/contact-me-server-form/ContactForm.module.css";
import adminStyles from "./admin.module.css";

const emptyValues = { title: "", content: "" };

export default function BlogAdminForm() {
  const [values, setValues] = useState(emptyValues);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  function clearImageFile() {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | publishing | published
  const [lastPost, setLastPost] = useState(null);

  // Edit mode: the slug of the post being edited (null = new post).
  const [editingSlug, setEditingSlug] = useState(null);
  const [deletingSlug, setDeletingSlug] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [hadImage, setHadImage] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  // Already-published posts (for the "manage" list below).
  const [posts, setPosts] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setListLoading(true);
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch {
      // Leave the list as-is on network hiccups.
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function updateImageFile(event) {
    const file = event.target.files?.[0];
    setImageFile(file && file.size > 0 ? file : null);
  }

  function startEditing(post) {
    setEditingSlug(post.slug);
    setValues({ title: post.title, content: post.content });
    setHadImage(Boolean(post.image));
    setRemoveImage(false);
    clearImageFile();
    setErrors({});
    setFormMessage("");
    setLastPost(null);
    setLastDeleted(null);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingSlug(null);
    setValues(emptyValues);
    setHadImage(false);
    setRemoveImage(false);
    clearImageFile();
    setErrors({});
    setFormMessage("");
    setStatus("idle");
  }

  async function handleDelete(post) {
    const confirmed = window.confirm(
      `Delete "${post.title}"? This cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setDeletingSlug(post.slug);
    try {
      const response = await fetch(`/api/blogs/${post.slug}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setLastDeleted(post.title);
        loadPosts();
      } else {
        setFormMessage(data.message ?? "The post could not be deleted. Please try again.");
      }
    } catch {
      setFormMessage("Could not reach the server. Please try again.");
    } finally {
      setDeletingSlug(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("publishing");
    setErrors({});
    setFormMessage("");

    try {
      // Editing → PUT /api/blogs/[slug]; new post → POST /api/blogs.
      const url = editingSlug
        ? `/api/blogs/${editingSlug}`
        : "/api/blogs";
      const method = editingSlug ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      if (editingSlug && removeImage) {
        formData.append("removeImage", "true");
      }

      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (response.ok && data.success) {
        setLastDeleted(null);
        if (editingSlug) {
          cancelEditing();
          setLastPost(data.post);
          setStatus("published");
        } else {
          setStatus("published");
          setLastPost(data.post);
          setValues(emptyValues);
          clearImageFile();
          event.target.reset();
        }
        loadPosts();
      } else {
        setStatus("idle");
        setErrors(data.errors ?? {});
        setFormMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("idle");
      setFormMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <>
      {status === "published" && lastPost && (
        <div className="card sent-banner" role="status">
          <h2>{editingSlug === null ? "Published!" : "Updated!"}</h2>
          <p>
            “{lastPost.title}” has been saved. You can keep writing — the
            next submit starts a new post.
          </p>
          <Link
            href={`/blogs/${lastPost.slug}`}
            className="button button-primary"
          >
            View the post
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className={formStyles.form} noValidate>
        {editingSlug && (
          <p className={adminStyles.editingNote}>
            Editing <b>“{values.title || editingSlug}”</b> — the web address
            of the post stays the same.{" "}
            <button
              type="button"
              onClick={cancelEditing}
              className={adminStyles.cancelButton}
            >
              Cancel editing
            </button>
          </p>
        )}

        <div className={formStyles.field}>
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            name="title"
            type="text"
            value={values.title}
            onChange={updateField}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "blog-title-error" : undefined}
          />
          {errors.title && (
            <p id="blog-title-error" className={formStyles.fieldError}>
              {errors.title}
            </p>
          )}
        </div>

        <div className={formStyles.field}>
          <label htmlFor="blog-content">Content</label>
          <textarea
            id="blog-content"
            name="content"
            rows={12}
            value={values.content}
            onChange={updateField}
            aria-invalid={errors.content ? "true" : "false"}
            aria-describedby={errors.content ? "blog-content-error" : undefined}
          />
          {errors.content && (
            <p id="blog-content-error" className={formStyles.fieldError}>
              {errors.content}
            </p>
          )}
        </div>

        <div className={formStyles.field}>
          <label htmlFor="blog-image-file">
            {editingSlug
              ? "Replace the cover image (optional)"
              : "Cover image — upload from your computer (optional)"}
          </label>
          <input
            id="blog-image-file"
            name="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            ref={fileInputRef}
            onChange={updateImageFile}
            aria-invalid={errors.image ? "true" : "false"}
            aria-describedby={errors.image ? "blog-image-error" : undefined}
          />
          {imageFile && (
            <p className={adminStyles.imageChip}>
              <span className={adminStyles.imageChipName}>
                {imageFile.name} ({Math.ceil(imageFile.size / 1024)} KB)
              </span>
              <button
                type="button"
                className={adminStyles.imageChipClear}
                onClick={clearImageFile}
                aria-label="Remove the selected image so you can choose another one"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M1 1 L9 9 M9 1 L1 9" />
                </svg>
              </button>
            </p>
          )}
          {editingSlug && hadImage && !imageFile && (
            <p className={adminStyles.imageNote}>
              <label>
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={(event) => setRemoveImage(event.target.checked)}
                />{" "}
                Remove the current cover image
              </label>
            </p>
          )}
          {errors.image && (
            <p id="blog-image-error" className={formStyles.fieldError}>
              {errors.image}
            </p>
          )}
        </div>

        {formMessage && (
          <p role="alert" className={formStyles.formError}>
            {formMessage}
          </p>
        )}

        <button
          type="submit"
          className="button button-primary"
          disabled={status === "publishing"}
        >
          {status === "publishing"
            ? "Saving…"
            : editingSlug
              ? "Save changes"
              : "Publish"}
        </button>
      </form>

      <section className="section" aria-label="Published posts">
        <h2 className="section-title">Published posts</h2>

        {lastDeleted && (
          <p className={adminStyles.deletedNote} role="status">
            Deleted &ldquo;{lastDeleted}&rdquo;.
          </p>
        )}

        {listLoading && <p>Loading posts…</p>}

        {!listLoading && posts.length === 0 && (
          <p>No posts published yet — your first one will appear here.</p>
        )}

        {!listLoading &&
          posts.map((post) => (
            <div key={post.id} className={adminStyles.manageRow}>
              <SectionNavRow
                href={`/blogs/${post.slug}`}
                label={new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                title={post.title}
                description={`${post.content.split("\n")[0].slice(0, 140)}…`}
                icon={<span>{posts.indexOf(post) + 1}</span>}
              />
              <div className={adminStyles.rowActions}>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  disabled={deletingSlug === post.slug}
                  className={adminStyles.deleteIconButton}
                  title="Delete"
                  aria-label={`Delete “${post.title}”`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 L6 18 M6 6 L18 18" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => startEditing(post)}
                  className={adminStyles.editIconButton}
                  title="Edit"
                  aria-label={`Edit “${post.title}”`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}
