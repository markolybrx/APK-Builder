import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // Import the component we made

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Android Builder",
  description: "Generate Android Apps from text descriptions using AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Navbar will now appear at the top of every page */}
        <Navbar />
        
        <main className="min-h-screen flex flex-col bg-slate-950 text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
