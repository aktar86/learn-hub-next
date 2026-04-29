"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface loginData {
  email: string;
  password: string; // Fixed typo: "pasword" -> "password"
}

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // callback url ditect
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<loginData> = async (data: loginData) => {
    const { email, password } = data;
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        console.log(result.error);
        // show error toast here
        return;
      }

      // success হলে redirect
      router.push(callbackUrl || "/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-5 text-black">
      <div>
        <h2 className="font-semibold text-2xl">Welcome Back</h2>
        <p>Please enter your details to sign in.</p>
      </div>
      {/* social login */}
      {/* or operator */}
      <div className="flex justify-between items-center gap-5">
        <hr className="border border-gray-300 grow" />{" "}
        {/* Fixed typo: "brder" -> "border" */}
        <p>OR</p>
        <hr className="border border-gray-300 grow" />{" "}
        {/* Fixed typo: "brder" -> "border" */}
      </div>
      {/* email login */}

      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block"> Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@gmail.com"
              className="border border-gray-300 outline-0 w-full p-2"
              required
              suppressHydrationWarning
            />
          </div>
          {/* Add password field since it's in your interface */}
          <div>
            <label className="block">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="border border-gray-300 outline-0 w-full p-2"
              required
              suppressHydrationWarning
            />
          </div>

          <input
            type="submit"
            value={loading ? "Login..." : "Login"}
            className="p-2 text-center w-full bg-primary text-white "
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
