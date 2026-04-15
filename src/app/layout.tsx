import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsappButton"; // 👈 add this
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jilani Home Tutor | Best Home Tutor in Raipur",
  description:
    "Looking for home tutor in Raipur? Get expert tutors for Maths, Science, English. Book free demo class today.",
  keywords: [
    "home tutor in Raipur",
    "home tuition Raipur",
    "maths tutor Raipur",
    "science tutor Raipur",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />

        {children}

        <WhatsAppButton />
      </body>
    </html>
  );
}

