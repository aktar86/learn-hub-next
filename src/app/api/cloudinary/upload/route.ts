/**
 * GET /api/cloudinary/upload?folder=xxx
 * Returns signed upload params so the client can upload directly to Cloudinary.
 * Never exposes the API secret to the browser.
 */
import { NextRequest } from "next/server";
import { generateSignedUploadParams } from "@/src/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const folder = req.nextUrl.searchParams.get("folder") ?? "learn-hub/lessons";
    const params = generateSignedUploadParams(folder);
    return Response.json(params);
  } catch (err) {
    console.error("[cloudinary/upload GET]", err);
    return Response.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
