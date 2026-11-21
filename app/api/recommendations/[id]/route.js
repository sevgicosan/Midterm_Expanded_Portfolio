// ============================================================
// API route for a single recommendation.
//
//   PUT /api/recommendations/[id] → update (JSON body, same
//     validation rules as POST)
//   DELETE /api/recommendations/[id] → remove it
//
// Used by the board so the visitor who submitted a note can
// edit or delete it. There is no authentication — matching the
// rest of the project, this is a course project without logins.
// ============================================================

import { NextResponse } from "next/server";
import { validateRecommendation } from "@/lib/learningExchangeValidation";
import {
  updateRecommendation,
  deleteRecommendation,
} from "@/lib/recommendationsStore";

function readFields(body) {
  return {
    name: typeof body.name === "string" ? body.name : "",
    title: typeof body.title === "string" ? body.title : "",
    category: typeof body.category === "string" ? body.category : "",
    url: typeof body.url === "string" ? body.url : "",
    description: typeof body.description === "string" ? body.description : "",
  };
}

export async function PUT(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, errors: {}, message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const fields = readFields(body);
  const errors = validateRecommendation(fields);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { success: false, errors, message: "Please fix the errors and try again." },
      { status: 400 }
    );
  }

  try {
    const recommendation = await updateRecommendation(id, fields);

    if (!recommendation) {
      return NextResponse.json(
        { success: false, message: "This recommendation does not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, recommendation });
  } catch (error) {
    console.error("Failed to update recommendation:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while saving. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const deleted = await deleteRecommendation(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "This recommendation does not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Recommendation deleted." });
  } catch (error) {
    console.error("Failed to delete recommendation:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while deleting. Please try again." },
      { status: 500 }
    );
  }
}
