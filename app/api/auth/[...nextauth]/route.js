import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/lib/db";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          // CRITICAL: This scope allows us to write to the USER'S repos
          scope: "repo read:user user:email",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    // 1. JWT Callback: Capture the access token when they first log in
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider; // Track which provider they used
      }
      return token;
    },
    // 2. Session Callback: Pass that token to the client so we can use it in the API
    async session({ session, token, user }) {
      session.user.id = user?.id || token?.sub;
      
      // If we are using database sessions (Adapter), we might need to query the 'accounts' collection
      // But for simplicity in hybrid mode, we attach what we can.
      // Note: With MongoDBAdapter, tokens are stored in the DB, not always in the session object automatically.
      
      return session;
    },
  },
  session: {
    strategy: "jwt", // Easier for managing tokens in Vercel
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  // This allows linking accounts (e.g. Logged in with Google -> Connect GitHub)
  events: {
    async linkAccount({ user, account, profile }) {
      console.log("Account linked successfully:", user.email);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
