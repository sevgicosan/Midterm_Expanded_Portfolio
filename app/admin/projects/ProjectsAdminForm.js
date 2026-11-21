"use client";

// ============================================================
// Projects admin UI (client component), following the Admin
// Blogs structure.
//
// Two jobs:
//   1. Add a new project: sends the form fields to
//      POST /api/projects.
//   2. Manage: lists the existing projects with Edit / Delete.
//      Editing loads a project into the same form (prefilled)
//      and saves through PUT /api/projects/[id]; Delete asks
//      for confirmation, then calls DELETE /api/projects/[id].
// The slug never changes on edit, so public URLs keep working.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SectionNavRow from "@/components/SectionNavRow";
import formStyles from "@/app/contact-me-server-form/ContactForm.module.css";
import adminStyles from "../blogs/admin.module.css";

const emptyValues = {
  title: "",
  shortDescription: "",
  githubUrl: "",
  technologies: "",
  overview: "",
  keyFeatures: "",
};

export default function ProjectsAdminForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | saved
  const [lastProject, setLastProject] = useState(null);

  // Edit mode: the id of the project being edited (null = new).
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  // Existing projects (for the "manage" list below).
  const [projects, setProjects] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setListLoading(true);
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch {
      // Leave the list as-is on network hiccups.
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function startEditing(project) {
    setEditingId(project.id);
    setValues({
      title: project.title,
      shortDescription: project.shortDescription,
      githubUrl: project.githubUrl,
      technologies: (project.technologies || []).join(", "),
      overview: (project.overview || []).join("\n\n"),
      keyFeatures: (project.keyFeatures || []).join("\n"),
    });
    setErrors({});
    setFormMessage("");
    setLastProject(null);
    setLastDeleted(null);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setValues(emptyValues);
    setErrors({});
    setFormMessage("");
    setStatus("idle");
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? Its page /projects/${project.slug} will be removed. This cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(project.id);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setLastDeleted(project.title);
        loadProjects();
      } else {
        setFormMessage(data.message ?? "The project could not be deleted. Please try again.");
      }
    } catch {
      setFormMessage("Could not reach the server. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    setErrors({});
    setFormMessage("");

    try {
      // Editing → PUT /api/projects/[id]; new → POST /api/projects.
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setLastDeleted(null);
        setStatus("saved");
        setLastProject(data.project);
        if (editingId) {
          cancelEditing();
        } else {
          setValues(emptyValues);
        }
        loadProjects();
      } else {
        setStatus("idle");
        setErrors(data.errors ?? {});
        setFormMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("idle");
      setFormMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <>
      {status === "saved" && lastProject && (
        <div className="card sent-banner" role="status">
          <h2>{lastDeleted === null && !editingId ? "Added!" : "Updated!"}</h2>
          <p>
            &ldquo;{lastProject.title}&rdquo; has been saved to the backend
            file. It now appears on the public Projects page.
          </p>
          <Link
            href={`/projects/${lastProject.slug}`}
            className="button button-primary"
          >
            View the project page
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className={formStyles.form} noValidate>
        {editingId && (
          <p className={adminStyles.editingNote}>
            Editing <b>&ldquo;{values.title}&rdquo;</b> — the web address of
            the project stays the same.{" "}
            <button
              type="button"
              onClick={cancelEditing}
              className={adminStyles.cancelButton}
            >
              Cancel editing
            </button>
          </p>
        )}

        <div className={formStyles.field}>
          <label htmlFor="project-title">Title</label>
          <input
            id="project-title"
            name="title"
            type="text"
            value={values.title}
            onChange={updateField}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "project-title-error" : undefined}
          />
          {errors.title && (
            <p id="project-title-error" className={formStyles.fieldError}>
              {errors.title}
            </p>
          )}
        </div>

        <div className={formStyles.field}>
          <label htmlFor="project-short">Short description</label>
          <input
            id="project-short"
            name="shortDescription"
            type="text"
            value={values.shortDescription}
            onChange={updateField}
            aria-invalid={errors.shortDescription ? "true" : "false"}
            aria-describedby={errors.shortDescription ? "project-short-error" : undefined}
          />
          {errors.shortDescription && (
            <p id="project-short-error" className={formStyles.fieldError}>
              {errors.shortDescription}
            </p>
          )}
        </div>

        <div className={formStyles.field}>
          <label htmlFor="project-url">GitHub URL</label>
          <input
            id="project-url"
            name="githubUrl"
            type="url"
            placeholder="https://github.com/…"
            value={values.githubUrl}
            onChange={updateField}
            aria-invalid={errors.githubUrl ? "true" : "false"}
            aria-describedby={errors.githubUrl ? "project-url-error" : undefined}
          />
          {errors.githubUrl && (
            <p id="project-url-error" className={formStyles.fieldError}>
              {errors.githubUrl}
            </p>
          )}
        </div>

        <div className={formStyles.field}>
          <label htmlFor="project-technologies">
            Technologies (separate with commas)
          </label>
          <input
            id="project-technologies"
            name="technologies"
            type="text"
            placeholder="Python, Jupyter Notebook"
            value={values.technologies}
            onChange={updateField}
          />
        </div>

        <div className={formStyles.field}>
          <label htmlFor="project-overview">
            Overview (one paragraph per line)
          </label>
          <textarea
            id="project-overview"
            name="overview"
            rows={8}
            value={values.overview}
            onChange={updateField}
            aria-invalid={errors.overview ? "true" : "false"}
            aria-describedby={errors.overview ? "project-overview-error" : undefined}
          />
          {errors.overview && (
            <p id="project-overview-error" className={formStyles.fieldError}>
              {errors.overview}
            </p>
          )}
        </div>

        <div className={formStyles.field}>
          <label htmlFor="project-features">
            Key features (one feature per line)
          </label>
          <textarea
            id="project-features"
            name="keyFeatures"
            rows={5}
            value={values.keyFeatures}
            onChange={updateField}
          />
        </div>

        {formMessage && (
          <p role="alert" className={formStyles.formError}>
            {formMessage}
          </p>
        )}

        <button
          type="submit"
          className="button button-primary"
          disabled={status === "saving"}
        >
          {status === "saving"
            ? "Saving…"
            : editingId
              ? "Save changes"
              : "Add project"}
        </button>
      </form>

      <section className="section" aria-label="Existing projects">
        <h2 className="section-title">Existing projects</h2>

        {lastDeleted && (
          <p className={adminStyles.deletedNote} role="status">
            Deleted &ldquo;{lastDeleted}&rdquo;.
          </p>
        )}

        {listLoading && <p>Loading projects…</p>}

        {!listLoading && projects.length === 0 && (
          <p>No projects yet — your first one will appear here.</p>
        )}

        {!listLoading &&
          projects.map((project) => (
            <div key={project.id} className={adminStyles.manageRow}>
              <SectionNavRow
                href={`/projects/${project.slug}`}
                label={project.technologies?.join(" · ")}
                title={project.title}
                description={project.shortDescription}
                icon={<span>{projects.indexOf(project) + 1}</span>}
              />
              <div className={adminStyles.rowActions}>
                <button
                  type="button"
                  onClick={() => handleDelete(project)}
                  disabled={deletingId === project.id}
                  className={adminStyles.deleteIconButton}
                  title="Delete"
                  aria-label={`Delete “${project.title}”`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 L6 18 M6 6 L18 18" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => startEditing(project)}
                  className={adminStyles.editIconButton}
                  title="Edit"
                  aria-label={`Edit “${project.title}”`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}
