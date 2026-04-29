import { getServerSession } from "next-auth";
import TestSession from "../components/TestSession/TestSession";
import { authOptions } from "../lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1>Home page here</h1>
      <div className="border mb-10 border-amber-300">
        <h1>Server Session</h1>
        <p>{JSON.stringify(session)}</p>
      </div>
      <div className="border">
        <TestSession></TestSession>
      </div>
    </>
  );
}
