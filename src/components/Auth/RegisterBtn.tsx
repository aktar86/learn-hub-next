import Link from "next/link";
import React from "react";

const RegisterBtn = () => {
  return (
    <Link href="/register">
      <button className="bg-primary text-white px-4 py-2 rounded">
        Register
      </button>
    </Link>
  );
};

export default RegisterBtn;
