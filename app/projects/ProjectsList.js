"use client";

// The Projects page content: reads the projects live from
// GET /api/projects (backed by data/projects.json), so projects
// added or edited in the admin page appear here right away.
// Reuses the same SectionNavRow rows as before.

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionNavRow from "@/components/SectionNavRow";
import styles from "./page.module.css";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        const data = await response.json();
        if (active && data.success) {
          setProjects(data.projects);
        }
      } catch {
        if (active) {
          setError("Could not load projects. Please refresh the page.");
        }
      }
      if (active) {
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="section" aria-label="List of projects">
        <p>Loading projects…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section" aria-label="List of projects">
        <p role="alert">{error}</p>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="section" aria-label="List of projects">
        <p>No projects yet — they will appear here once added.</p>
      </section>
    );
  }

  return (
    <>
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
    </>
  );
}
