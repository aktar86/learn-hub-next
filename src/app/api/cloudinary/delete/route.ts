/**
 * DELETE /api/cloudinary/delete
 * Body: { publicId: string, resourceType?: "video" | "image" | "raw" }
 * Deletes a Cloudinary asset server-side.
 */
import { NextRequest } from "next/server";
import { deleteCloudinaryAsset } from "@/src/lib/cloudinary";

export async function DELETE(req: NextRequest) {
  try {
    const { publicId, resourceType = "raw" } = await req.json();
    if (!publicId) {
      return Response.json({ error: "publicId is required" }, { status: 400 });
    }
    const result = await deleteCloudinaryAsset(publicId, resourceType);
    return Response.json({ success: true, result });
  } catch (err) {
    console.error("[cloudinary/delete DELETE]", err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
