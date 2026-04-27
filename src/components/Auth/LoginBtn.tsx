"use client";
import Link from "next/link";
import React from "react";

const LoginBtn = () => {
  return (
    <Link href="/login">
      <button>Login</button>
    </Link>
  );
};

export default LoginBtn;
