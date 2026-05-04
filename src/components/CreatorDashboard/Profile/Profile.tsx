"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

const Profile = () => {
  const session = useSession();
  console.log("Email", session.data?.user?.email);
  return (
    <div className="flex justify-baseline items-center gap-4 w-full my-2">
      <Image
        src={session.data?.user?.image || "/default-avatar.png"} // ইমেজ না থাকলে একটি লোকাল ইমেজ দেখাবে
        alt="User Profile"
        width={50}
        height={50}
        className="rounded-full" // ইমেজটি গোল করার জন্য
      />
      <div>
        <p className="text-lg font-bold">{session.data?.user?.name}</p>
        <p className="text-xs">{session.data?.user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
