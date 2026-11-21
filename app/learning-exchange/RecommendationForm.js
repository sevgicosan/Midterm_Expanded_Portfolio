"use client";

// The recommendation form, floating in a modal. Validates in the
// browser first, then hands the fields to `submitWith` (which
// posts them to /api/recommendations). On success the parent
// closes the modal; on failure the server's error messages are
// shown under the fields — same UX as the contact forms.

import { useState } from "react";
import {
  LEARNING_CATEGORIES,
  validateRecommendation,
} from "@/lib/learningExchangeValidation";
import styles from "./page.module.css";

export default function RecommendationForm({
  submitWith,
  initialValues,
  submitLabel,
  onCancel,
}) {
  const [values, setValues] = useState({
    name: initialValues?.name ?? "",
    title: initialValues?.title ?? "",
    category: initialValues?.category ?? "",
    url: initialValues?.url ?? "",
    description: initialValues?.description ?? "",
  });
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // 1. Browser-side check (instant feedback).
    const nextErrors = validateRecommendation(values);
    setErrors(nextErrors);
    setFormMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // 2. Send to the server, which re-checks with the same rules.
    setSubmitting(true);
    const result = await submitWith({
      name: values.name.trim(),
      title: values.title.trim(),
      category: values.category,
      url: values.url.trim(),
      description: values.description.trim(),
    });
    setSubmitting(false);

    if (result && !result.success) {
      setErrors(result.errors ?? {});
      setFormMessage(
        result.message ?? "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="le-name">Your name</label>
        <input
          id="le-name"
          name="name"
          type="text"
          value={values.name}
          onChange={updateField}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "le-name-error" : undefined}
        />
        {errors.name && (
          <p id="le-name-error" className={styles.fieldError}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="le-title">Resource title</label>
        <input
          id="le-title"
          name="title"
          type="text"
          placeholder="e.g. Introduction to Data Science"
          value={values.title}
          onChange={updateField}
          aria-invalid={errors.title ? "true" : "false"}
          aria-describedby={errors.title ? "le-title-error" : undefined}
        />
        {errors.title && (
          <p id="le-title-error" className={styles.fieldError}>
            {errors.title}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="le-category">Platform / category</label>
        <select
          id="le-category"
          name="category"
          value={values.category}
          onChange={updateField}
          aria-invalid={errors.category ? "true" : "false"}
          aria-describedby={errors.category ? "le-category-error" : undefined}
        >
          <option value="">Choose one…</option>
          {LEARNING_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="le-category-error" className={styles.fieldError}>
            {errors.category}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="le-url">Link (optional)</label>
        <input
          id="le-url"
          name="url"
          type="url"
          placeholder="https://…"
          value={values.url}
          onChange={updateField}
          aria-invalid={errors.url ? "true" : "false"}
          aria-describedby={errors.url ? "le-url-error" : undefined}
        />
        {errors.url && (
          <p id="le-url-error" className={styles.fieldError}>
            {errors.url}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="le-description">Why do you recommend it?</label>
        <textarea
          id="le-description"
          name="description"
          rows={5}
          placeholder="What made it worth your time, and who is it for?"
          value={values.description}
          onChange={updateField}
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={
            errors.description ? "le-description-error" : undefined
          }
        />
        {errors.description && (
          <p id="le-description-error" className={styles.fieldError}>
            {errors.description}
          </p>
        )}
      </div>

      {formMessage && (
        <p role="alert" className={styles.fieldError}>
          {formMessage}
        </p>
      )}

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className="button button-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="button button-primary"
        >
          {submitting ? "Saving…" : submitLabel ?? "Submit Recommendation"}
        </button>
      </div>
    </form>
  );
}
