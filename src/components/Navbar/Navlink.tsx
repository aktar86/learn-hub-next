"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavlinkProps {
  href: string;
  children: React.ReactNode;
}

const Navlink = ({ href, children }: NavlinkProps) => {
  const pathName = usePathname();

  const isActive = pathName === href ? "text-green-500" : "";

  return (
    <Link className={isActive} href={href}>
      {children}
    </Link>
  );
};

export default Navlink;
