// ============================================================
// API route: /api/recommendations
//
//   GET  → all community recommendations, newest first
//   POST → validate + save a new recommendation
//
// The Learning Exchange board loads its notes from here, so
// recommendations are shared among ALL visitors. Personal
// "My Learning List" saving stays in the visitor's browser
// (LocalStorage) and never passes through this route.
// ============================================================

import { NextResponse } from "next/server";
import { validateRecommendation } from "@/lib/learningExchangeValidation";
import {
  getRecommendations,
  saveRecommendation,
} from "@/lib/recommendationsStore";

export async function GET() {
  try {
    const recommendations = await getRecommendations();
    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error("Failed to load recommendations:", error);
    return NextResponse.json(
      { success: false, message: "Recommendations could not be loaded." },
      { status: 500 }
    );
  }
}

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
  const fields = {
    name: typeof body.name === "string" ? body.name : "",
    title: typeof body.title === "string" ? body.title : "",
    category: typeof body.category === "string" ? body.category : "",
    url: typeof body.url === "string" ? body.url : "",
    description: typeof body.description === "string" ? body.description : "",
  };

  // 3. Validate on the server with the SAME rules as the form
  //    shows in the browser.
  const errors = validateRecommendation(fields);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        success: false,
        errors,
        message: "Please fix the errors and try again.",
      },
      { status: 400 }
    );
  }

  // 4. Save to the shared JSON file and answer with the saved note.
  try {
    const recommendation = await saveRecommendation(fields);
    return NextResponse.json(
      {
        success: true,
        message: "Recommendation saved.",
        recommendation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save recommendation:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message:
          "Something went wrong while saving. Please try again.",
      },
      { status: 500 }
    );
  }
}
