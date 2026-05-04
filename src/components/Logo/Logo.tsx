import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <h1 className="text-2xl font-black ">
        <span className="text-gray-500">Learn</span>
        <span className="text-primary">Hub</span>
        <span className="text-primary">.</span>
      </h1>
    </Link>
  );
};

export default Logo;
