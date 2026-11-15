// ============================================================
// Contact form validation rules.
// These are "pure" functions: they only look at their inputs
// and return a result, with no side effects. That makes them
// easy to read and test on their own.
// ============================================================

// Basic email shape: text @ text . text (no spaces allowed).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidName(name) {
  return typeof name === "string" && name.trim().length > 0;
}

export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  if (/\s/.test(email)) return false; // reject any whitespace, e.g. "a b@x.com"
  if ((email.match(/@/g) || []).length !== 1) return false; // exactly one @
  return EMAIL_PATTERN.test(email); // checks "@domain.tld" formatting
}

export function isValidMessage(message) {
  return typeof message === "string" && message.trim().length > 0;
}

// Checks all fields at once and returns an object of error
// messages. An empty object means everything is valid.
export function validateContactForm({ name, email, message }) {
  const errors = {};

  if (!isValidName(name)) {
    errors.name = "Please enter your name.";
  }

  if (!isValidEmail(email)) {
    errors.email =
      "Please enter a valid email address (for example, name@example.com).";
  }

  if (!isValidMessage(message)) {
    errors.message = "Please enter a message.";
  }

  return errors;
}
