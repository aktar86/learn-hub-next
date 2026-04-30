import TestSession from "../components/TestSession/TestSession";

import { session } from "./layout";

export default async function Home() {
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
