import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/layout/Navbar"; // <--- UPDATED PATH

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
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <SessionProvider>
          <Navbar />
          <div className="pt-16"> {/* Padding for fixed navbar */}
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
