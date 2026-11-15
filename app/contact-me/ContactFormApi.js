"use client";

// ============================================================
// "Get in Touch" form UI (client component).
//
// Unlike the /contact-me-server-form page (which submits to a
// Server Action), this form talks to a classic API endpoint:
// it sends the fields as JSON to POST /api/contacts with
// fetch(), then renders whatever the API answers — field
// errors or a success banner. No page reload, no redirect.
// ============================================================

import { useState } from "react";
import formStyles from "../contact-me-server-form/ContactForm.module.css";

const emptyValues = { name: "", email: "", message: "" };

export default function ContactFormApi() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  function updateField(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setFormMessage("");

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("sent");
        setValues(emptyValues);
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

  if (status === "sent") {
    return (
      <div className="card sent-banner" role="status">
        <h2>Message received!</h2>
        <p>
          Thanks for reaching out — your message was delivered through the
          API. I will get back to you soon.
        </p>
        <button
          type="button"
          className="button button-primary"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form} noValidate>
      <div className={formStyles.field}>
        <label htmlFor="api-name">Name</label>
        <input
          id="api-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={updateField}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "api-name-error" : undefined}
        />
        {errors.name && (
          <p id="api-name-error" className={formStyles.fieldError}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={formStyles.field}>
        <label htmlFor="api-email">Email</label>
        <input
          id="api-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={updateField}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "api-email-error" : undefined}
        />
        {errors.email && (
          <p id="api-email-error" className={formStyles.fieldError}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={formStyles.field}>
        <label htmlFor="api-message">Message</label>
        <textarea
          id="api-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={updateField}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "api-message-error" : undefined}
        />
        {errors.message && (
          <p id="api-message-error" className={formStyles.fieldError}>
            {errors.message}
          </p>
        )}
      </div>

      {formMessage && (
        <p role="alert" className={formStyles.formError}>
          {formMessage}
        </p>
      )}

      <button
        type="submit"
        className="button button-primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
