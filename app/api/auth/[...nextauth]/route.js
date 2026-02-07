import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // We need these scopes to write code to their repos
      authorization: {
        params: {
          scope: "repo read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Pass the access token to the client so we can use it for API calls
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
