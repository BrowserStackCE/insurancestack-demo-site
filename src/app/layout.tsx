import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HexclaveProvider, HexclaveTheme } from "@hexclave/next";
import { hexclaveServerApp } from "@/stack/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insurance Stack — Coverage that stacks in your favor",
  description:
    "Modern insurance for auto, home, life, and business. Layered protection, transparent pricing, and claims resolved in days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <HexclaveProvider app={hexclaveServerApp}>
          <HexclaveTheme>
            {children}
          </HexclaveTheme>
        </HexclaveProvider>
      </body>
    </html>
  );
}
