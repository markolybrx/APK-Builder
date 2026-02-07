import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/db"; // You might need to create this adapter file

export const authOptions = {
  // Adapter allows us to link Google & GitHub accounts to the same user in DB
  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          // We still need repo access to push code
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
    async session({ session, token, user }) {
      // If using Adapter, 'user' object is available. If using JWT, 'token' is available.
      session.user.id = user?.id || token?.sub;
      
      // Pass the GitHub Access Token if it exists (for repo creation)
      // Note: With Adapter, tokens are stored in the 'accounts' collection in DB
      // We might need to fetch it manually or persist it in the session here
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt", // We use JWT to avoid database hits on every request, simpler for Vercel
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Custom login page we will build next
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };