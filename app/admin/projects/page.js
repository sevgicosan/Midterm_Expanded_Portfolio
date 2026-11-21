import ProjectsAdminForm from "./ProjectsAdminForm";

export const metadata = {
  title: "Projects Admin",
  description: "Manage the projects shown on the public Projects page.",
  // Personal admin page — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function ProjectsAdminPage() {
  return (
    <div className="container">
      <ProjectsAdminForm />
    </div>
  );
}
