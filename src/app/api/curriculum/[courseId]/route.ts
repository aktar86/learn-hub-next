/**
 * PUT    /api/curriculum/[courseId]  — update sections
 * DELETE /api/curriculum/[courseId]  — delete entire curriculum
 */
import { NextRequest } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import { CURRICULUM_COLLECTION } from "@/src/models/Curriculum";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/curriculum/[courseId]">,
) {
  try {
    const { courseId } = await ctx.params;
    const { sections } = await req.json();

    if (!sections) {
      return Response.json({ error: "sections is required" }, { status: 400 });
    }

    const col = dbConnect(CURRICULUM_COLLECTION);
    const result = await col.updateOne(
      { courseId },
      {
        $set: { sections, updatedAt: new Date().toISOString() },
        $setOnInsert: { courseId, createdAt: new Date().toISOString() },
      },
      { upsert: true },
    );

    return Response.json({ success: true, matched: result.matchedCount });
  } catch (err) {
    console.error("[curriculum PUT]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/curriculum/[courseId]">,
) {
  try {
    const { courseId } = await ctx.params;
    const col = dbConnect(CURRICULUM_COLLECTION);
    await col.deleteOne({ courseId });
    return Response.json({ success: true });
  } catch (err) {
    console.error("[curriculum DELETE]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
