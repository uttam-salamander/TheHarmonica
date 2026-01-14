import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HarpFlow - Learn Harmonica with Real-Time Feedback",
  description:
    "Master the harmonica with instant visual feedback. Detect notes, bends, and bleed in real-time. No account needed.",
  keywords: ["harmonica", "learn harmonica", "music education", "bending", "blues harp"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
