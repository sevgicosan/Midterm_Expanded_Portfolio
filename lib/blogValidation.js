// ============================================================
// Server-side validation rules for blog posts.
// Mirrors lib/contactValidation.js: returns an object with one
// entry per invalid field; an empty object means the post is
// valid. The browser is never trusted — the API calls this.
// ============================================================

const MAX_TITLE_LENGTH = 120;
const MAX_CONTENT_LENGTH = 20000;

export function validateBlogPost({ title, content }) {
  const errors = {};

  const cleanTitle = typeof title === "string" ? title.trim() : "";
  const cleanContent = typeof content === "string" ? content.trim() : "";

  if (!cleanTitle) {
    errors.title = "Please enter a title.";
  } else if (cleanTitle.length > MAX_TITLE_LENGTH) {
    errors.title = `Please keep the title under ${MAX_TITLE_LENGTH} characters.`;
  }

  if (!cleanContent) {
    errors.content = "Please write some content.";
  } else if (cleanContent.length > MAX_CONTENT_LENGTH) {
    errors.content = `Please keep the content under ${MAX_CONTENT_LENGTH} characters.`;
  }

  return errors;
}
