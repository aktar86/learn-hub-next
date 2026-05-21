import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/authOptions";
import { dbConnect, collection } from "@/src/lib/dbConnect";
import MyCourses, { CourseItem } from "@/src/components/CreatorDashboard/MyCourses/MyCourses";

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  const email = session?.email ?? "";

  let courses: CourseItem[] = [];

  if (email) {
    try {
      const col = dbConnect(collection.COURSES);
      const docs = await col
        .find({ instructorEmail: email })
        .sort({ createdAt: -1 })
        .toArray();

      // Serialize — MongoDB _id is an ObjectId, must be stringified
      courses = docs.map((d) => ({
        _id: d._id.toString(),
        title: d.title ?? "",
        subtitle: d.subtitle ?? "",
        category: d.category ?? "",
        level: d.level ?? "",
        price: Number(d.price) || 0,
        thumbnailUrl: d.thumbnailUrl ?? "",
        status: d.status ?? "draft",
        createdAt: d.createdAt ?? new Date().toISOString(),
        updatedAt: d.updatedAt ?? new Date().toISOString(),
      }));
    } catch (err) {
      console.error("[MyCoursesPage] DB error:", err);
    }
  }

  return <MyCourses initialCourses={courses} />;
}
