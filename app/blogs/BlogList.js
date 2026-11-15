"use client";

// ============================================================
// Public blog list (client component).
//
// Makes a GET request to /api/blogs and renders every post as
// a card in a responsive grid: cover image (uploaded file or
// web link), publish date, serif title, and a short excerpt.
// Clicking a card opens the full post at /blogs/[slug].
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { PaperPlaneIcon } from "@/components/icons";
import styles from "./page.module.css";

export default function BlogList() {
  const [posts, setPosts] = useState(null); // null = still loading
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/blogs");
        const data = await response.json();

        if (response.ok && data.success) {
          setPosts(data.posts);
        } else {
          setLoadError(true);
        }
      } catch {
        setLoadError(true);
      }
    }

    loadPosts();
  }, []);

  if (loadError) {
    return <p>Could not load the blog posts. Please try again later.</p>;
  }

  if (posts === null) {
    return <p>Loading posts…</p>;
  }

  if (posts.length === 0) {
    return <p>No posts yet — check back soon.</p>;
  }

  return (
    <div className={styles.grid}>
      {posts.map((post) => {
        const excerpt =
          post.content.split("\n")[0].slice(0, 120) +
          (post.content.length > 120 ? "…" : "");

        return (
          <Link key={post.id} href={`/blogs/${post.slug}`} className={styles.card}>
            <span className={styles.imageWrap}>
              {post.image ? (
                <img
                  src={post.image}
                  alt={`Cover image for ${post.title}`}
                  className={styles.image}
                  loading="lazy"
                />
              ) : (
                <span className={styles.placeholder} aria-hidden="true">
                  <PaperPlaneIcon size={30} />
                </span>
              )}
            </span>

            <span className={styles.body}>
              <span className={styles.date}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className={styles.title}>{post.title}</span>
              <span className={styles.excerpt}>{excerpt}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
