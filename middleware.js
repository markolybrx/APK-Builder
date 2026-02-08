export { default } from "next-auth/middleware";

// Only protect the dashboard routes. The Landing Page ("/") remains public.
export const config = {
  matcher: ["/dashboard/:path*"]
};
