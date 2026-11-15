// ============================================================
// JSON storage for contact form submissions.
//
// Every valid submission is APPENDED to data/submissions.json,
// so previous submissions are never overwritten. If the file
// does not exist yet (first submission), it is created.
// ============================================================

import { promises as fs } from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data");
const submissionsFilePath = path.join(dataDirectory, "submissions.json");

export async function saveSubmission(submission) {
  let submissions = [];

  try {
    const fileContents = await fs.readFile(submissionsFilePath, "utf8");
    const parsed = JSON.parse(fileContents);

    // Only keep going if the file contains an array of submissions.
    if (Array.isArray(parsed)) {
      submissions = parsed;
    }
  } catch {
    // The file does not exist yet (or is empty) — start a new list.
    submissions = [];
  }

  submissions.push(submission);

  // Make sure the data folder exists, then write the full list back.
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(
    submissionsFilePath,
    JSON.stringify(submissions, null, 2),
    "utf8"
  );
}
