"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

interface IFormInput {
  firstName: string;
  gender: GenderEnum;
}

interface FormProps {
  name: string;
  email: string;
  role: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "learn",
      password: "",
    },
  });

  // বর্তমানে কোনটি সিলেক্ট করা আছে তা ট্র্যাক করা
  const selectedRole = watch("role");

  const onSubmit: SubmitHandler<FormProps> = (data: FormProps) => {
    console.log("Selected Data:", data);
  };

  return (
    <div className="max-w-md mx-auto mt-5 space-y-2 border p-5 bg-white text-black ">
      {/* head */}
      <div>
        <h3 className="text-2xl font-bold">Create a account</h3>
        <p>Start your learning journey today</p>
      </div>

      {/* google login */}
      <div>
        {/* Social icon will be available here */}
        {/* google login */}
      </div>

      {/* or operator */}
      <div className="flex justify-between items-center gap-5">
        <hr className="brder border-gray-300 grow" />
        <p>OR</p>
        <hr className="brder border-gray-300 grow" />
      </div>

      {/* register form */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block">Student Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Write your name"
              className="border border-gray-300 outline-0 w-full p-2 "
              required
              suppressHydrationWarning
            />
          </div>

          <div>
            <label className="block"> Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@gmail.com"
              className="border border-gray-300 outline-0 w-full p-2 "
              required
              suppressHydrationWarning
            />
          </div>

          {/* checkbox */}
          <label className="block  font-semibold  mb-3">I want to...</label>

          <div className="flex gap-4">
            {/* Learn Option */}
            <label
              className={`relative flex flex-col justify-between w-full h-24 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === "learn"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <input
                {...register("role")}
                type="radio"
                value="learn"
                className="hidden"
              />
              <span className="text-2xl">🎓</span>
              <span className="font-medium text-gray-800">Learn</span>

              {/* Custom Radio Circle */}
              <div
                className={`absolute top-3 right-3 w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedRole === "learn"
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selectedRole === "learn" && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </div>
            </label>

            {/* Teach Option */}
            <label
              className={`relative flex flex-col justify-between w-full h-24 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === "teach"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <input
                {...register("role")}
                type="radio"
                value="teach"
                className="hidden"
              />
              <span className="text-2xl text-orange-800">👨‍🏫</span>
              <span className="font-medium text-gray-800">Teach</span>

              {/* Custom Radio Circle */}
              <div
                className={`absolute top-3 right-3 w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedRole === "teach"
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selectedRole === "teach" && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </div>
            </label>
          </div>

          {/* password */}
          <div>
            <label className="block">Password</label>

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter password"
              className="border border-gray-300 outline-0 w-full p-2"
              suppressHydrationWarning
            />

            {errors.password && <p>{errors.password.message}</p>}
          </div>

          {/* button  */}
          <input
            type="submit"
            value="Register"
            className="p-2 text-center w-full bg-primary text-white"
          />
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
