// ============================================================
// API routes for projects.
//
//   GET  /api/projects  → list of all projects (public — the
//                         Projects page reads through this)
//   POST /api/projects  → add a new project
//
// All data lives in data/projects.json via lib/projectsStore.
// ============================================================

import { NextResponse } from "next/server";
import { validateProject } from "@/lib/projectValidation";
import { getProjects, saveProject } from "@/lib/projectsStore";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    console.error("Failed to load projects:", error);
    return NextResponse.json(
      { success: false, message: "Could not load projects." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

  // Read the fields defensively (never trust the client).
  const fields = {
    title: typeof body.title === "string" ? body.title : "",
    shortDescription:
      typeof body.shortDescription === "string" ? body.shortDescription : "",
    githubUrl: typeof body.githubUrl === "string" ? body.githubUrl : "",
    technologies: body.technologies,
    overview: body.overview,
    keyFeatures: body.keyFeatures,
  };

  const errors = validateProject(fields);
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

  try {
    const project = await saveProject(fields);
    return NextResponse.json(
      { success: true, project, message: "Project added." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save project:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Something went wrong while saving the project. Please try again.",
      },
      { status: 500 }
    );
  }
}
