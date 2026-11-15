// ============================================================
// API route: POST /api/contacts
//
// The classic endpoint-based alternative to Server Actions.
// A client page sends a JSON body here with fetch(); this
// handler validates it on the server and stores the submission
// in the same JSON file used by the server-action form.
//
// Every submission is labeled with a "source" field so the
// owner can see which form it came from:
//   - "api-form"      → sent through this API endpoint
//   - "server-form"   → sent through /contact-me-server-form
// ============================================================

import { NextResponse } from "next/server";
import { validateContactForm } from "@/lib/contactValidation";
import { saveSubmission } from "@/lib/submissionsStore";

export async function POST(request) {
  // 1. Parse the JSON body (reject anything that isn't valid JSON).
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Request body must be valid JSON.",
      },
      { status: 400 }
    );
  }

  // 2. Read the fields defensively (never trust the client).
  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  const message = typeof body.message === "string" ? body.message : "";

  // 3. Validate on the server with the same rules as the other form.
  const errors = validateContactForm({ name, email, message });

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        success: false,
        errors,
        message: "Please fix the errors below and try again.",
      },
      { status: 400 }
    );
  }

  // 4. Save into the shared data/submissions.json, labeled by source.
  try {
    await saveSubmission({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      source: "api-form",
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Something went wrong while saving your message. Please try again.",
      },
      { status: 500 }
    );
  }

  // 5. Tell the client it worked.
  return NextResponse.json(
    {
      success: true,
      message: "Thanks for reaching out! Your message has been received.",
    },
    { status: 201 }
  );
}
