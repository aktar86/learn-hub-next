/**
 * MongoDB document structure for a course curriculum.
 * Uses the native MongoDB driver (already in the project) — no Mongoose.
 */

export type LessonType = "video" | "pdf" | "text" | "assignment";

export interface LessonDoc {
  _id: string;
  title: string;
  type: LessonType;
  description: string;
  duration: string;          // "10:30" for video, "5 min" for text
  cloudinaryUrl: string;
  publicId: string;
  fileType: string;          // mime type
  fileSize: number;          // bytes
  isPreviewFree: boolean;
  isPublished: boolean;
  order: number;
}

export interface ModuleDoc {
  _id: string;
  title: string;
  order: number;
  lessons: LessonDoc[];
}

export interface SectionDoc {
  _id: string;
  title: string;
  order: number;
  collapsed: boolean;
  modules: ModuleDoc[];
}

export interface CurriculumDoc {
  _id?: string;
  courseId: string;           // links to a course document
  sections: SectionDoc[];
  updatedAt: string;
  createdAt: string;
}

/** Collection name constant */
export const CURRICULUM_COLLECTION = "curriculums";
