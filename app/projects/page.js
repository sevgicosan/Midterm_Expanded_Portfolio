import ProjectsList from "./ProjectsList";

export const metadata = {
  title: "My Projects",
  description: "A showcase of projects built by Sevgi Cosan Senbaslar.",
};

export default function ProjectsPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">My Projects</h1>
        <p className="page-intro">
          Take a look at some of the academic projects I&apos;ve worked on
          throughout my master&apos;s program! They are pulled live from the{" "}
          <code>GET /api/projects</code> endpoint.
        </p>
      </header>

      <ProjectsList />
    </div>
  );
}
