import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
  console.log("Authorize: checking credentials", credentials);
  await mongoose.connect(process.env.MONGODB_URI!);
  const user = await User.findOne({ email: credentials?.email });
  if (!user) {
    console.log("User not found");
    return null;
  }
  if (!user.password) {
    console.log("User has no password");
    return null;
  }
  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) {
    console.log("Password invalid");
    return null;
  }

  console.log("Auth successful");
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}

    }),
  ],
  session: { strategy: "jwt" as "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    error: "/auth/error",
    newUser: "/dashboard",
  },
  callbacks: {
   async session({ session, token }) {
    if (session.user && token.sub) {
      session.user.id = token.sub;
    }
    return session;
  },
   async redirect({ url, baseUrl }) {
    // If url is relative, allow it, otherwise fallback to dashboard
    if (url.startsWith("/")) return url;
    return "/dashboard";
  },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };