import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/layout/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AppBuild AI - Text to Android App",
  description: "Generate real Android apps using AI",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-zinc-300 selection:bg-pink-500/30`}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen pt-16"> 
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
