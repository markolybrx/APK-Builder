import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Providers } from "./providers"; // Import the new file

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AppBuild - AI Android App Builder",
  description: "Generate Android Apps with Gemini AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* <--- WRAP EVERYTHING HERE */}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
