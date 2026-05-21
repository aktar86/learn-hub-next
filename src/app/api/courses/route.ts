/**
 * POST /api/courses  — create a new course
 * GET  /api/courses?email=xxx — list courses by instructor
 */
import { NextRequest } from "next/server";
import { dbConnect, collection } from "@/src/lib/dbConnect";
import { CourseDoc } from "@/src/models/Course";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const col = dbConnect(collection.COURSES);
    const filter = email ? { instructorEmail: email } : {};
    const courses = await col.find(filter).sort({ createdAt: -1 }).toArray();
    return Response.json({ data: courses });
  } catch (err) {
    console.error("[courses GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<CourseDoc, "_id">;

    if (!body.title?.trim()) {
      return Response.json({ error: "Course title is required" }, { status: 400 });
    }
    if (!body.category) {
      return Response.json({ error: "Category is required" }, { status: 400 });
    }
    if (!body.instructorEmail) {
      return Response.json({ error: "Instructor email is required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const doc: Omit<CourseDoc, "_id"> = {
      ...body,
      price: Number(body.price) || 0,
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status ?? "draft",
      createdAt: now,
      updatedAt: now,
    };

    const col = dbConnect(collection.COURSES);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await col.insertOne(doc as any);

    return Response.json(
      { data: { ...doc, _id: result.insertedId.toString() } },
      { status: 201 },
    );
  } catch (err) {
    console.error("[courses POST]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
