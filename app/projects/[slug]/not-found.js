import Link from "next/link";

// This 404 renders ONLY for unknown project addresses (e.g.
// /projects/none). Other unknown URLs still get the global 404.
export const metadata = {
  title: "Project Not Found",
};

export default function ProjectNotFound() {
  return (
    <div className="container notfound">
      <h1 className="page-title">404 — Project Not Found</h1>
      <p className="page-intro">
        Sorry, this project does not exist. It may have been moved,
        or the address may be mistyped.
      </p>
      <p className="notfound-actions">
        <Link href="/" className="button button-primary">
          Back to Home
        </Link>
        <Link href="/projects" className="button button-secondary">
          Browse Projects
        </Link>
      </p>
    </div>
  );
}
