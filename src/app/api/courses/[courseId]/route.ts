/**
 * GET    /api/courses/[courseId]  — fetch single course
 * PUT    /api/courses/[courseId]  — update course (status, fields)
 * DELETE /api/courses/[courseId]  — delete course
 */
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect, collection } from "@/src/lib/dbConnect";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/courses/[courseId]">,
) {
  try {
    const { courseId } = await ctx.params;
    const col = dbConnect(collection.COURSES);
    const course = await col.findOne({ _id: new ObjectId(courseId) });
    if (!course) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: course });
  } catch (err) {
    console.error("[courses/[courseId] GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/courses/[courseId]">,
) {
  try {
    const { courseId } = await ctx.params;
    const body = await req.json();
    const col = dbConnect(collection.COURSES);

    const { _id, createdAt, ...updates } = body;
    void _id; void createdAt; // strip immutable fields

    await col.updateOne(
      { _id: new ObjectId(courseId) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
    );
    return Response.json({ success: true });
  } catch (err) {
    console.error("[courses/[courseId] PUT]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/courses/[courseId]">,
) {
  try {
    const { courseId } = await ctx.params;
    const col = dbConnect(collection.COURSES);
    await col.deleteOne({ _id: new ObjectId(courseId) });
    return Response.json({ success: true });
  } catch (err) {
    console.error("[courses/[courseId] DELETE]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
