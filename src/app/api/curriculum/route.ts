/**
 * POST /api/curriculum  — create a new curriculum document
 * GET  /api/curriculum?courseId=xxx — fetch curriculum for a course
 */
import { NextRequest } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import { CURRICULUM_COLLECTION, CurriculumDoc } from "@/src/models/Curriculum";

export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return Response.json({ error: "courseId is required" }, { status: 400 });
    }
    const col = dbConnect(CURRICULUM_COLLECTION);
    const doc = await col.findOne({ courseId });
    return Response.json({ data: doc ?? null });
  } catch (err) {
    console.error("[curriculum GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<CurriculumDoc, "_id">;
    if (!body.courseId) {
      return Response.json({ error: "courseId is required" }, { status: 400 });
    }
    const col = dbConnect(CURRICULUM_COLLECTION);

    // Prevent duplicates
    const existing = await col.findOne({ courseId: body.courseId });
    if (existing) {
      return Response.json({ error: "Curriculum already exists for this course" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const doc: CurriculumDoc = {
      ...body,
      sections: body.sections ?? [],
      createdAt: now,
      updatedAt: now,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await col.insertOne(doc as any);
    return Response.json({ data: { ...doc, _id: result.insertedId } }, { status: 201 });
  } catch (err) {
    console.error("[curriculum POST]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
