import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "../action/server/auth";

// ইন্টারফেসটি authorize ফাংশনের ভেতরে ব্যবহারের জন্য
interface LoginProps {
  email?: string;
  password?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // credentials অবজেক্ট খালি রাখলে রানটাইমে সমস্যা হতে পারে,
      // তাই এখানে টাইপগুলো ডিফাইন করে দেওয়া ভালো
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });

        if (user) {
          // এরর সমাধান: _id কে id হিসেবে রিটার্ন করুন
          return {
            id: user._id.toString(), // NextAuth-এর জন্য 'id' প্রয়োজন
            email: user.email,
            name: user.name,
            // অন্য যেসব ডাটা প্রয়োজন...
          };
        }
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
