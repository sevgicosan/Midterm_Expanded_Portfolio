"use server";

// ============================================================
// Server Action for the contact form.
//
// This code runs ONLY on the server. The client form calls it
// through <form action={...}>. It receives the form fields,
// validates them, and — if valid — saves the submission to the
// local JSON file. It always returns a plain "state" object
// that the form uses to show success or error messages.
// ============================================================

import { redirect } from "next/navigation";
import { validateContactForm } from "@/lib/contactValidation";
import { saveSubmission } from "@/lib/submissionsStore";

export async function saveContactForm(previousState, formData) {
  // 1. Read the raw field values from the submitted form.
  const name = formData.get("name") ?? "";
  const email = formData.get("email") ?? "";
  const message = formData.get("message") ?? "";

  // 2. Validate on the server (never trust the browser).
  const errors = validateContactForm({ name, email, message });

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: "Please fix the errors below and try again.",
      values: { name, email, message },
    };
  }

  // 3. Save the valid submission (appends to the JSON file).
  try {
    await saveSubmission({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      source: "server-form",
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return {
      success: false,
      errors: {},
      message:
        "Something went wrong while saving your message. Please try again.",
      values: { name, email, message },
    };
  }

  // 4. Success — redirect to the same page with ?sent=1. The page
  //     then shows a confirmation banner, and the form itself
  //     mounts fresh and empty. Redirecting also prevents the
  //     "stale success message" problem when visitors navigate
  //     away and come back later.
  redirect("/contact-me-server-form?sent=1");
}
