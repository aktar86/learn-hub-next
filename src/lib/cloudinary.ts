/**
 * Cloudinary configuration and server-side upload utilities.
 * Only import this in server components / route handlers — never in client code.
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/** Generate a signed upload params object for the client-side widget / XHR */
export function generateSignedUploadParams(folder: string) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );
  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    folder,
  };
}

/** Delete a Cloudinary asset by public_id */
export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "video" | "image" | "raw" = "raw",
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    throw err;
  }
}
