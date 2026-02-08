import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Only protect the dashboard routes
  matcher: ["/dashboard/:path*"]
};
