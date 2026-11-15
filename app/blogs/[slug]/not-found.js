import Link from "next/link";

// This 404 renders ONLY for unknown blog addresses (e.g.
// /blogs/none) — including posts that were deleted from the
// admin page. Other unknown URLs still get the global 404.
export const metadata = {
  title: "Post Not Found",
};

export default function BlogNotFound() {
  return (
    <div className="container notfound">
      <h1 className="page-title">404 — Post Not Found</h1>
      <p className="page-intro">
        Sorry, this blog post does not exist. It may have been deleted,
        or the address may be mistyped.
      </p>
      <p className="notfound-actions">
        <Link href="/" className="button button-primary">
          Back to Home
        </Link>
        <Link href="/blogs" className="button button-secondary">
          Browse Blogs
        </Link>
      </p>
    </div>
  );
}
