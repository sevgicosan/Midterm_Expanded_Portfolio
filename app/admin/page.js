import SectionNavRow from "@/components/SectionNavRow";

export const metadata = {
  title: "Admin",
  description: "Admin tools for managing the portfolio.",
  // Personal admin pages — keep them out of search results.
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Admin</h1>
        <p className="page-intro">
          Tools for managing the content of this site. These pages are
          intentionally not linked in the navigation.
        </p>
      </header>

      <section className="section" aria-label="Admin pages">
        <SectionNavRow
          href="/admin/blogs"
          title="Blog Admin"
          description="Publish new blog posts, and edit or delete the existing ones."
        />
        <SectionNavRow
          href="/admin/contacts"
          title="Contact Requests"
          description="Read the messages from Let's Get in Touch, set their status, and add private notes."
        />
        <SectionNavRow
          href="/admin/projects"
          title="Projects Admin"
          description="Add new projects, and edit or delete the existing ones."
        />
      </section>
    </div>
  );
}
