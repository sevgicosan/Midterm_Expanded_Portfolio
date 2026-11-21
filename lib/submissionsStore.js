// ============================================================
// JSON storage for contact form submissions.
//
// Every valid submission is APPENDED to data/submissions.json,
// so previous submissions are never overwritten. If the file
// does not exist yet (first submission), it is created.
//
// The admin Contact Requests page reads the same file via
// getSubmissions() and manages each request with
// updateSubmission() / deleteSubmission(). Older entries were
// saved before submissions had ids or admin fields, so reads
// normalize them with stable, deterministic ids; the id (plus
// status and adminNotes) is materialized into the file the
// first time that entry is written back.
// ============================================================

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const dataDirectory = path.join(process.cwd(), "data");
const submissionsFilePath = path.join(dataDirectory, "submissions.json");

const CONTACT_STATUSES = ["New", "Reviewed", "Responded"];

// Older rows only had { name, email, message, submittedAt }.
// Give every row a stable id (derived from its position and
// timestamp so repeated reads agree) and default admin fields.
function normalizeSubmissions(list) {
  return list.map((entry, index) => ({
    ...entry,
    id: entry.id || `contact-${index + 1}-${entry.submittedAt || "unknown"}`,
    status: CONTACT_STATUSES.includes(entry.status) ? entry.status : "New",
    adminNotes: typeof entry.adminNotes === "string" ? entry.adminNotes : "",
  }));
}

async function readSubmissions() {
  try {
    const fileContents = await fs.readFile(submissionsFilePath, "utf8");
    const parsed = JSON.parse(fileContents);
    return Array.isArray(parsed) ? normalizeSubmissions(parsed) : [];
  } catch {
    return [];
  }
}

async function writeSubmissions(submissions) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(
    submissionsFilePath,
    JSON.stringify(submissions, null, 2),
    "utf8"
  );
}

// Full list for the admin inbox, newest first.
export async function getSubmissions() {
  const submissions = await readSubmissions();
  return submissions
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => String(b.entry.submittedAt || "").localeCompare(String(a.entry.submittedAt || "")))
    .map(({ entry }) => entry);
}

export async function saveSubmission(submission) {
  const submissions = await readSubmissions();
  submissions.push({
    ...submission,
    id: randomUUID(),
    status: "New",
    adminNotes: "",
  });
  await writeSubmissions(submissions);
}

// Update ONLY the admin-managed fields (status, adminNotes).
// The visitor's original name, email, and message are copied
// through untouched.
export async function updateSubmission(id, patch) {
  const submissions = await readSubmissions();
  const index = submissions.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  const current = submissions[index];
  submissions[index] = {
    ...current,
    id: current.id,
    name: current.name,
    email: current.email,
    message: current.message,
    submittedAt: current.submittedAt,
    source: current.source,
    status: CONTACT_STATUSES.includes(patch.status) ? patch.status : current.status,
    adminNotes: typeof patch.adminNotes === "string" ? patch.adminNotes : current.adminNotes,
  };

  await writeSubmissions(submissions);
  return submissions[index];
}

export async function deleteSubmission(id) {
  const submissions = await readSubmissions();
  const next = submissions.filter((entry) => entry.id !== id);

  if (next.length === submissions.length) {
    return false;
  }

  await writeSubmissions(next);
  return true;
}
