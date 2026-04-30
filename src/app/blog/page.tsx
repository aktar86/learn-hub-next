import { authOptions } from "@/src/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const BlogPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return <div>This is blog page </div>;
};

export default BlogPage;
