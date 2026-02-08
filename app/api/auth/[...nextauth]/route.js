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
          // CRITICAL: 'repo' scope gives full read/write access to user's private repos
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
    // This adds the user ID to the session object so we can identify them in the API
    async session({ session, token, user }) {
      session.user.id = user?.id || token?.sub;
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT for easier session management on Vercel
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Redirect here if unauthorized
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
