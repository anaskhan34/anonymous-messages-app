import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";

import "../globals.css";

import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const robotoHeading = Roboto({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "True Dashboard",
  description: "Real feedback from real people.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable, robotoHeading.variable)}
    >
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
