// ============================================================
// API routes: PUT /api/projects/[id] and DELETE /api/projects/[id]
//
//   PUT    → update an existing project (title, short
//            description, GitHub URL, technologies, overview,
//            key features). The slug never changes, so existing
//            /projects/[slug] URLs keep working.
//   DELETE → permanently remove the project.
//
// ============================================================

import { NextResponse } from "next/server";
import { validateProject } from "@/lib/projectValidation";
import { deleteProject, updateProject } from "@/lib/projectsStore";

export async function PUT(request, { params }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, errors: {}, message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

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

  const { id } = await params;
  try {
    const updated = await updateProject(id, fields);

    if (!updated) {
      return NextResponse.json(
        { success: false, errors: {}, message: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, project: updated, message: "Project updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Could not update the project. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, errors: {}, message: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {},
        message: "Could not delete the project. Please try again.",
      },
      { status: 500 }
    );
  }
}
