"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const GoogleLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: callBackUrl,
        redirect: false,
      });
      if (result?.ok) {
        Swal.fire({
          icon: "success",
          text: "Login Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push(callBackUrl);
      } else if (result?.error) {
        Swal.fire({
          icon: "error",
          text: "Login Failed",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-white hover:bg-primary hover:text-white rounded-xl py-2 my-5  transition "
    >
      <Image
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        width={24}
        height={24}
      ></Image>
      <span> Sign in with google</span>
    </button>
  );
};

export default GoogleLogin;
