"use client";

import { useSession } from "next-auth/react";
import LoginBtn from "./LoginBtn";
import LogoutBtn from "./LogoutBtn";
import RegisterBtn from "./RegisterBtn";

const AuthBtnNav = () => {
  const session = useSession();
  return (
    <div>
      {session.status === "authenticated" ? (
        <LogoutBtn></LogoutBtn>
      ) : (
        <div className=" flex justify-center items-center space-x-3">
          <LoginBtn />
          <RegisterBtn />
        </div>
      )}
    </div>
  );
};

export default AuthBtnNav;
