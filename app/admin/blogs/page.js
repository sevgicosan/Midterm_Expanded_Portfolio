import BlogAdminForm from "./BlogAdminForm";

export const metadata = {
  title: "Blog Admin",
  description: "Publish new blog posts.",
  // Personal admin page — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function BlogAdminPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Blog Admin</h1>
        <p className="page-intro">
          Write a post and publish it — it goes straight to the public blog
          via <code>POST /api/blogs</code>. This page is intentionally not
          linked in the navigation.
        </p>
      </header>

      <BlogAdminForm />
    </div>
  );
}
