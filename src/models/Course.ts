/** MongoDB document shape for a course. */
export interface CourseDoc {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  language: string;
  tags: string[];           // stored as array
  price: number;
  thumbnailUrl: string;     // Cloudinary secure_url
  thumbnailPublicId: string;
  status: "draft" | "published";
  instructorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export const COURSES_COLLECTION = "courses";
