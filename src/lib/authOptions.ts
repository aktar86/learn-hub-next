import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "../action/server/auth";
import { collection, dbConnect } from "./dbConnect";
import GoogleProvider from "next-auth/providers/google";

// ইন্টারফেসটি authorize ফাংশনের ভেতরে ব্যবহারের জন্য
// interface LoginProps {
//   email?: string;
//   password?: string;
// }

// Session এবং Token এর জন্য টাইপ ডিক্লেয়ারেশন
declare module "next-auth" {
  interface Session {
    role?: string;
    email?: string;
  }

  interface User {
    email?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    email?: string;
  }
}

const usersCollection = dbConnect(collection.USERS);
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isExist = await usersCollection.findOne({ email: user?.email });
      if (!isExist) {
        const newUser = {
          provider: account?.provider,
          name: user?.name,
          email: user?.email?.toLowerCase().trim(),
          image: user?.image,
          role: "learn",
          createAt: new Date().toISOString(),
        };
        const result = await usersCollection.insertOne(newUser);
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.role = token?.role as string; // ✅ corrected
        session.email = token?.email as string; // ✅ corrected
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log(user);
      if (user) {
        if (account?.provider === "google") {
          const googleUser = await usersCollection.findOne({
            email: user?.email,
          });
          if (googleUser) {
            token.role = googleUser?.role;
            token.email = googleUser?.email;
          }
        } else {
          token.role = user?.role; // ✅ corrected (removed extra quotes)
          token.email = user?.email;
        }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
