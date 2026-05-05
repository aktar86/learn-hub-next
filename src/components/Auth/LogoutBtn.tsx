"use client";
import { signOut } from "next-auth/react";

const LogoutBtn = () => {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };
  return (
    <button onClick={handleLogout} className="text-red-500  ">
      Logout
    </button>
  );
};

export default LogoutBtn;
