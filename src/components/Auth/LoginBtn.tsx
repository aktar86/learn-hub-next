"use client";
import Link from "next/link";
import React from "react";

const LoginBtn = () => {
  return (
    <Link href="/login">
      <button className="bg-secondary text-white px-4 py-2 rounded">
        Login
      </button>
    </Link>
  );
};

export default LoginBtn;
