// ============================================================
// API routes: PUT /api/contacts/[id] and DELETE /api/contacts/[id]
//
// Management of a single contact request.
//   PUT    → update the status (New / Reviewed / Responded) and
//            the private admin notes. The visitor's original
//            name, email, and message are never editable.
//   DELETE → permanently remove the request.
// ============================================================

import { NextResponse } from "next/server";
import { deleteSubmission, updateSubmission } from "@/lib/submissionsStore";

export async function PUT(request, { params }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { id } = await params;
  try {
    const updated = await updateSubmission(id, {
      status: typeof body.status === "string" ? body.status : undefined,
      adminNotes: typeof body.adminNotes === "string" ? body.adminNotes : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Contact request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, submission: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update contact submission:", error);
    return NextResponse.json(
      { success: false, message: "Could not update the contact request." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const deleted = await deleteSubmission(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Contact request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete contact submission:", error);
    return NextResponse.json(
      { success: false, message: "Could not delete the contact request." },
      { status: 500 }
    );
  }
}
