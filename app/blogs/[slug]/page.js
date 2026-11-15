import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { getBlogBySlug, getBlogs } from "@/lib/blogsStore";
import styles from "./page.module.css";

// Pre-render one page per blog post that exists at build time
// (same pattern as the Projects page). Posts published later,
// while the site is running, are rendered on demand the first
// time someone opens their URL.
//
// Cache Components requires at least one result here, so when
// no posts exist yet we return a placeholder slug — its page
// simply calls notFound() and renders the 404 page.
export async function generateStaticParams() {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return [{ slug: "no-posts-yet" }];
  }

  return blogs.map((blog) => ({ slug: blog.slug }));
}

// Reading the JSON file is "runtime data", which Cache
// Components only allows through the cache. Posts can now be
// EDITED from the admin page, so a cached page must not live
// forever: cacheLife("minutes") keeps each cached copy for
// about a minute, so an edit becomes visible on the public
// page shortly after saving.
async function getCachedBlogBySlug(slug) {
  "use cache";
  cacheLife("minutes");
  return getBlogBySlug(slug);
}

// Give each blog post its own browser tab title.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getCachedBlogBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 150),
  };
}

// This ONE template renders every blog post. The "slug" comes
// from the URL and decides which post is displayed — the same
// dynamic-routing pattern as the Projects page. An unknown
// slug (e.g. /blogs/does-not-exist) shows the 404 page.
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getCachedBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="container">
      <header className="page-header">
        <p className={styles.date}>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="page-title">{post.title}</h1>
      </header>

      <article className={`card ${styles.article}`}>
        {post.image && (
          <img
            src={post.image}
            alt={`Cover image for “${post.title}”`}
            className={styles.cover}
          />
        )}
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </article>

      <p>
        <Link href="/blogs" className="text-link">
          ← Back to all posts
        </Link>
      </p>
    </div>
  );
}
