// ============================================================
// JSON storage for projects.
//
// All project data lives in data/projects.json (migrated from
// the former static lib/projects.js dataset). The public
// Projects pages read through here, and the admin Projects
// page creates, updates, and deletes through here.
//
// Each project looks like:
// {
//   "id": "a1b2c3…",
//   "slug": "h1b-program-fairness-analysis",
//   "title": "…",
//   "shortDescription": "…",
//   "technologies": ["Python", …],
//   "githubUrl": "https://github.com/…",
//   "overview": ["paragraph", …],
//   "keyFeatures": ["feature", …]
// }
// The slug is the project's permanent web address: it is set
// once on create and never changes afterwards, so existing
// /projects/[slug] URLs keep working after any edit.
// ============================================================

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const dataDirectory = path.join(process.cwd(), "data");
const projectsFilePath = path.join(dataDirectory, "projects.json");

export async function getProjects() {
  try {
    const fileContents = await fs.readFile(projectsFilePath, "utf8");
    const parsed = JSON.parse(fileContents);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // File does not exist yet (or is unreadable) — no projects.
  }

  return [];
}

export async function getProjectBySlug(slug) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

// Turns a title into a URL-safe slug, e.g. "My Cool Project!"
// becomes "my-cool-project". If another project already uses
// that slug, a number suffix is added: "my-cool-project-2".
function buildUniqueSlug(title, existingSlugs) {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "project";

  if (!existingSlugs.includes(base)) {
    return base;
  }

  let counter = 2;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter += 1;
  }
  return `${base}-${counter}`;
}

function normalizeList(value, splitOnCommas = false) {
  // Accepts an array of strings, or one string. Technologies
  // are typed comma-separated on one line, so they split on
  // commas too; prose fields (overview, key features) split on
  // line breaks ONLY — commas in a sentence must survive.
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(splitOnCommas ? /\r?\n|,/ : /\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export async function saveProject({ title, shortDescription, githubUrl, technologies, overview, keyFeatures }) {
  const projects = await getProjects();
  const existingSlugs = projects.map((project) => project.slug);

  const project = {
    id: randomUUID(),
    slug: buildUniqueSlug(title.trim(), existingSlugs),
    title: title.trim(),
    shortDescription: shortDescription.trim(),
    githubUrl: githubUrl.trim(),
    technologies: normalizeList(technologies, true),
    overview: normalizeList(overview),
    keyFeatures: normalizeList(keyFeatures),
  };

  projects.push(project);

  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), "utf8");

  return project;
}

// Updates an existing project found by its id. The slug never
// changes, so links to the project keep working after an edit.
// Returns the updated project, or null if the id does not exist.
export async function updateProject(id, { title, shortDescription, githubUrl, technologies, overview, keyFeatures }) {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...projects[index],
    title: title.trim(),
    shortDescription: shortDescription.trim(),
    githubUrl: githubUrl.trim(),
    technologies: normalizeList(technologies, true),
    overview: normalizeList(overview),
    keyFeatures: normalizeList(keyFeatures),
  };

  projects[index] = updated;

  await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), "utf8");

  return updated;
}

// Deletes a project by its id. Returns true if a project was
// removed, false if the id does not exist.
export async function deleteProject(id) {
  const projects = await getProjects();
  const next = projects.filter((project) => project.id !== id);

  if (next.length === projects.length) {
    return false;
  }

  await fs.writeFile(projectsFilePath, JSON.stringify(next, null, 2), "utf8");

  return true;
}
