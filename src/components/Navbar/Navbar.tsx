import React from "react";
import Logo from "../Logo/Logo";
import Navlink from "./Navlink";
import LoginBtn from "../Auth/LoginBtn";
import RegisterBtn from "../Auth/RegisterBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/authOptions";
import LogoutBtn from "../Auth/LogoutBtn";
import AuthBtnNav from "../Auth/AuthBtnNav";
import Link from "next/link";
import ThemeToggle from "../NextThemeProvider/ThemeToggle";

const Navbar = () => {
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
    <header className="w-full border-b ">
      <div className="py-5  max-w-7xl mx-auto flex justify-between items-center ">
        {/* logo */}
        <Logo />
        {/* nav */}
        <nav>
          <ul className="flex justify-center items-center space-x-3">
            {links}
          </ul>
        </nav>
        {/* auth btn */}
        <div className="flex justify-between items-center gap-5 ">
          <ThemeToggle />
          <Link href="/dashboard">Dashboard</Link>
          <AuthBtnNav></AuthBtnNav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
