// ============================================================
// Server-side validation rules for projects.
// Mirrors lib/blogValidation.js: returns an object with one
// entry per invalid field; an empty object means the project
// is valid. The browser is never trusted — the API calls this.
// ============================================================

const MAX_TITLE_LENGTH = 120;
const MAX_SHORT_DESCRIPTION_LENGTH = 300;
const MAX_FIELD_LENGTH = 5000;

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function validateProject({ title, shortDescription, githubUrl, overview }) {
  const errors = {};

  const cleanTitle = typeof title === "string" ? title.trim() : "";
  const cleanShort = typeof shortDescription === "string" ? shortDescription.trim() : "";
  const cleanUrl = typeof githubUrl === "string" ? githubUrl.trim() : "";
  const overviewList = normalizeList(overview);

  if (!cleanTitle) {
    errors.title = "Please enter a project title.";
  } else if (cleanTitle.length > MAX_TITLE_LENGTH) {
    errors.title = `Please keep the title under ${MAX_TITLE_LENGTH} characters.`;
  }

  if (!cleanShort) {
    errors.shortDescription = "Please enter a short description.";
  } else if (cleanShort.length > MAX_SHORT_DESCRIPTION_LENGTH) {
    errors.shortDescription = `Please keep the short description under ${MAX_SHORT_DESCRIPTION_LENGTH} characters.`;
  }

  if (!cleanUrl) {
    errors.githubUrl = "Please enter the GitHub repository URL.";
  } else if (!isHttpUrl(cleanUrl)) {
    errors.githubUrl = "Please enter a valid URL starting with http:// or https://.";
  }

  if (overviewList.length === 0) {
    errors.overview = "Please write at least one overview paragraph.";
  }

  overviewList.forEach((paragraph) => {
    if (paragraph.length > MAX_FIELD_LENGTH) {
      errors.overview = "Please keep each overview paragraph under 5000 characters.";
    }
  });

  return errors;
}
