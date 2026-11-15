import BlogList from "./BlogList";

export const metadata = {
  title: "Blog",
  description: "Thoughts, notes, and stories by Sevgi Cosan Senbaslar.",
};

export default function BlogsPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Blog</h1>
        <p className="page-intro">
          Notes and stories from my journey — pulled live from the
          <code> GET /api/blogs</code> endpoint.
        </p>
      </header>

      <BlogList />
    </div>
  );
}
