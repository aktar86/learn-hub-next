"use client";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  ClipboardList,
  LogOut,
  MessageCircleQuestionMark,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import Logo from "../../Logo/Logo";
import Profile from "../Profile/Profile";
import { usePathname } from "next/navigation";
// import LogoutBtn from "../../Auth/LogoutBtn";
import { signOut } from "next-auth/react";

const AsideSection = () => {
  const pathname = usePathname();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  const menuItems = [
    {
      name: "Overview",
      href: "/dashboard/overview",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Create Course",
      href: "/dashboard/createcourse",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "My Courses",
      href: "/dashboard/mycourse",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Assignment",
      href: "/dashboard/assignment",
      icon: <ClipboardList size={20} />,
    },
  ];

  return (
    <aside className=" bg-white text-black h-screen p-5 fixed w-64 ">
      <div className="flex flex-col h-full">
        <div className="flex-1 border-b border-gray-300">
          <div className="mb-5">
            <Logo />
          </div>
          <div>
            <Profile />
            <ul className="mt-5 space-y-2">
              {menuItems.map((item) => {
                // চেক করা হচ্ছে বর্তমান পাথ আইটেমের লিঙ্কের সাথে মিলে কি না
                const active = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-md hover:pl-3 transition-all duration-300  ${
                        active
                          ? "bg-primary/20 text-primary font-semibold"
                          : "bg-white text-black"
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="pb-20 flex  flex-col  ">
          <div className="flex gap-2 items-center hover:ml-2 p-2 hover:bg-gray-50 rounded-xl  text-gray-700 transition-all">
            <MessageCircleQuestionMark />
            <p> Helo Center</p>
          </div>
          <div className="flex gap-2 items-center hover:ml-2 hover:bg-gray-50 rounded-xl  text-gray-700  p-2 transition-all">
            <LogOut />
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AsideSection;
