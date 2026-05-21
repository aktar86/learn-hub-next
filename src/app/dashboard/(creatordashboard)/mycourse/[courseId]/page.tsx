import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { dbConnect, collection } from "@/src/lib/dbConnect";
import { CURRICULUM_COLLECTION } from "@/src/models/Curriculum";
import CourseDetail from "@/src/components/CreatorDashboard/CourseDetail/CourseDetail";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params;

  // Validate ObjectId format before querying
  if (!ObjectId.isValid(courseId)) notFound();

  try {
    const courseCol = dbConnect(collection.COURSES);
    const curriculumCol = dbConnect(CURRICULUM_COLLECTION);

    const [courseDoc, curriculumDoc] = await Promise.all([
      courseCol.findOne({ _id: new ObjectId(courseId) }),
      curriculumCol.findOne({ courseId }),
    ]);

    if (!courseDoc) notFound();

    // Serialize ObjectIds → strings for client components
    const course = JSON.parse(JSON.stringify({
      ...courseDoc,
      _id: courseDoc._id.toString(),
    }));

    const curriculum = curriculumDoc
      ? JSON.parse(JSON.stringify({
          ...curriculumDoc,
          _id: curriculumDoc._id?.toString(),
        }))
      : null;

    return <CourseDetail course={course} curriculum={curriculum} />;
  } catch (err) {
    console.error("[CourseDetailPage]", err);
    notFound();
  }
}
