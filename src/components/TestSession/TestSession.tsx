"use client";

import { useSession } from "next-auth/react";

const TestSession = () => {
  const session = useSession();
  return (
    <div>
      <h1>Client Session</h1>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
};

export default TestSession;
