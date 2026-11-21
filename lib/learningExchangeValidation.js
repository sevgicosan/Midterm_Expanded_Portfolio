// Client-side validation for Learning Exchange recommendations.
// Lives in lib/ so the form stays presentational and any future
// version (e.g. a server-backed one) can reuse the same rules.

export const LEARNING_CATEGORIES = [
  "LinkedIn Learning",
  "Coursera",
  "Udemy",
  "YouTube",
  "edX / Harvard Online",
  "Book",
  "Podcast",
  "Other",
];

export function validateRecommendation({ name, title, category, url, description }) {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Please add your name.";
  } else if (name.trim().length < 2) {
    errors.name = "Your name needs at least 2 characters.";
  }

  if (!title.trim()) {
    errors.title = "Please add the resource title.";
  } else if (title.trim().length < 3) {
    errors.title = "The title needs at least 3 characters.";
  }

  if (!category) {
    errors.category = "Please choose a platform or category.";
  }

  if (url.trim()) {
    try {
      const parsed = new URL(url.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.url = "The link must start with http:// or https://";
      }
    } catch {
      errors.url = "This does not look like a valid link.";
    }
  }

  if (!description.trim()) {
    errors.description = "Please tell others why you recommend this.";
  }

  return errors;
}
