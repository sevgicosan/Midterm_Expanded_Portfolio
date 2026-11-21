import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { getProjectBySlug, getProjects } from "@/lib/projectsStore";
import styles from "./page.module.css";

// Pre-render one page per project that exists at build time
// (same pattern as the blog detail pages). Projects added later,
// while the site is running, are rendered on demand the first
// time someone opens their URL.
//
// Cache Components requires at least one result here, so when
// no projects exist yet we return a placeholder slug — its page
// simply calls notFound() and renders the 404 page.
export async function generateStaticParams() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return [{ slug: "no-projects-yet" }];
  }

  return projects.map((project) => ({ slug: project.slug }));
}

// Reading the JSON file is "runtime data", which Cache
// Components only allows through the cache. Projects can be
// EDITED from the admin page, so a cached page must not live
// forever: cacheLife("minutes") keeps each cached copy for
// about a minute, so an edit becomes visible on the public
// page shortly after saving.
async function getCachedProjectBySlug(slug) {
  "use cache";
  cacheLife("minutes");
  return getProjectBySlug(slug);
}

// Give each project page its own browser tab title.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

// This ONE template renders every project. The "slug" comes from
// the URL and decides which project's content is displayed.
export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);

  // Unknown slug (e.g. /projects/does-not-exist) → show the 404 page.
  if (!project) {
    notFound();
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">{project.title}</h1>
        <p className="page-intro">{project.shortDescription}</p>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`button button-primary ${styles.githubButton}`}
        >
          View on GitHub
        </a>
      </header>

      <section className="section" aria-label="Technologies used">
        <h2 className="section-title">Technologies Used</h2>
        <ul className={styles.techList}>
          {project.technologies.map((technology) => (
            <li key={technology} className="tag">
              {technology}
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-label="Project overview">
        <h2 className="section-title">Overview</h2>
        <div className="card">
          {project.overview.map((paragraph) => (
            <p key={paragraph} className={styles.overviewParagraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section" aria-label="Key features">
        <h2 className="section-title">Key Features</h2>
        <ul className="card">
          {project.keyFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <p>
        <Link href="/projects" className="text-link">
          ← Back to all projects
        </Link>
      </p>
    </div>
  );
}
