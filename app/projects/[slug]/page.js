import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/projects";
import styles from "./page.module.css";

// Pre-render one page per project at build time.
// The "slug" values here become the URLs: /projects/product-inventory
// and /projects/competitive-ai.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Give each project page its own browser tab title.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

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
  const project = getProjectBySlug(slug);

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
