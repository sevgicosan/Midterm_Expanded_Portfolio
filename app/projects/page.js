import Link from "next/link";
import SectionNavRow from "@/components/SectionNavRow";
import { projects } from "@/lib/projects";
import styles from "./page.module.css";

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
          throughout my master&apos;s program!
        </p>
      </header>

      <section className="section" aria-label="List of projects">
        {projects.map((project, index) => (
          <SectionNavRow
            key={project.slug}
            icon={
              <span className={styles.rowNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
            }
            title={project.title}
            description={project.shortDescription}
            href={`/projects/${project.slug}`}
          />
        ))}
      </section>

      <p>
        Curious about the details or want to collaborate?{" "}
        <Link href="/contact-me-server-form" className="text-link">
          Contact me
        </Link>
        .
      </p>
    </div>
  );
}
