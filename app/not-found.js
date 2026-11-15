import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="container notfound">
      <h1 className="page-title">404 — Page Not Found</h1>
      <p className="page-intro">
        Sorry, the page you are looking for does not exist. It may have been
        moved, or the address may be mistyped.
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
