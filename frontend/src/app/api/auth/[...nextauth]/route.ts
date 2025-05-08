// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

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
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const user = await res.json();

          if (res.ok && user && user.id && user.email) {
            // For credential providers, we need to manually handle user creation in MongoDB
            // This ensures user data is stored in the same collection as OAuth users
            const client = await clientPromise;
            const db = client.db();
            
            // Check if user already exists in MongoDB
            const existingUser = await db.collection("users").findOne({ email: user.email });
            
            if (!existingUser) {
              // Create the user in MongoDB if they don't exist
              await db.collection("users").insertOne({
                id: user.id,
                email: user.email,
                name: user.name || '',
                image: user.image || '',
                emailVerified: null,
              });
            }
            
            return user;
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        
        // Store the provider (google or credentials)
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        // Add provider info to the session if needed
        session.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt" // Important for credentials provider
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };