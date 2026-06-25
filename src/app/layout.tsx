import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DisclaimerModal from "@/components/DisclaimerModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DermaRare AI - Rare Skin Disease Education",
  description: "Learn about 30 rare skin conditions with our AI-powered symptom matching engine and conversational medical assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-base text-text-main font-inter">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <DisclaimerModal />
      </body>
    </html>
  );
}
