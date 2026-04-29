"use server";

import { collection, dbConnect } from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

interface registerProps {
  name?: string;
  email: string;
  password: string;
  role?: string;
}

interface loginProps {
  email: string;
  password: string;
}

interface RegistrationResult {
  acknowledged: boolean;
  insertedId: string;
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
    provider: string;
    createAt: string;
  };
}
const usercollection = dbConnect(collection.USERS);

export const postUser = async (
  payload: registerProps,
): Promise<RegistrationResult | null> => {
  const { name, email, role, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // create user
    const newUser = {
      provider: "credential",
      name: name || "Anonymous", // 👈 default value
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "user",
      createAt: new Date().toISOString(),
    };

    const result = await usercollection.insertOne(newUser);

    // Complete MongoDB result রিটার্ন করুন
    return {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId.toString(), // ObjectId to string
      message: "User created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        provider: newUser.provider,
        createAt: newUser.createAt,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// login user

export const loginUser = async (payload: loginProps) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const user = await usercollection.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
