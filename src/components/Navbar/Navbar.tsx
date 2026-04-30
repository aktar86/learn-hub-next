import React from "react";
import Logo from "../Logo/Logo";
import Navlink from "./Navlink";
import LoginBtn from "../Auth/LoginBtn";
import RegisterBtn from "../Auth/RegisterBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/authOptions";
import LogoutBtn from "../Auth/LogoutBtn";
import AuthBtnNav from "../Auth/AuthBtnNav";

const Navbar = async () => {
  const links = (
    <>
      <li>
        <Navlink href="/">Home</Navlink>
      </li>
      <li>
        <Navlink href="/blog">Blog</Navlink>
      </li>
      <li>
        <Navlink href="/courses">Courses</Navlink>
      </li>
    </>
  );
  return (
    <header>
      <div className="py-10 border-b w-full flex justify-between items-center ">
        {/* logo */}
        <Logo />
        {/* nav */}
        <nav>
          <ul className="flex justify-center items-center space-x-3">
            {links}
          </ul>
        </nav>
        {/* auth btn */}
        <AuthBtnNav></AuthBtnNav>
      </div>
    </header>
  );
};

export default Navbar;
