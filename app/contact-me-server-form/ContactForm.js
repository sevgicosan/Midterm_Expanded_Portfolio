"use client";

// ============================================================
// Contact form UI (client component).
//
// useActionState connects this form to the "saveContactForm"
// Server Action. After each submit, React re-renders with the
// state the server returned: validation errors or a save
// error. A successful submit redirects to the same page with
// ?sent=1, where a confirmation banner is shown.
// ============================================================

import { useActionState } from "react";
import { saveContactForm } from "./actions";
import styles from "./ContactForm.module.css";

const initialFormState = {
  errors: {},
  message: "",
  values: { name: "", email: "", message: "" },
};

export default function ContactForm() {
  const [formState, formAction, isPending] = useActionState(
    saveContactForm,
    initialFormState
  );

  return (
    <form action={formAction} className={styles.form} noValidate>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={formState.errors.name ? "true" : "false"}
          aria-describedby={formState.errors.name ? "name-error" : undefined}
        />
        {formState.errors.name && (
          <p id="name-error" className={styles.fieldError}>
            {formState.errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={formState.errors.email ? "true" : "false"}
          aria-describedby={formState.errors.email ? "email-error" : undefined}
        />
        {formState.errors.email && (
          <p id="email-error" className={styles.fieldError}>
            {formState.errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={formState.errors.message ? "true" : "false"}
          aria-describedby={
            formState.errors.message ? "message-error" : undefined
          }
        />
        {formState.errors.message && (
          <p id="message-error" className={styles.fieldError}>
            {formState.errors.message}
          </p>
        )}
      </div>

      {formState.message && (
        <p role="alert" className={styles.formError}>
          {formState.message}
        </p>
      )}

      <button
        type="submit"
        className="button button-primary"
        disabled={isPending}
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
