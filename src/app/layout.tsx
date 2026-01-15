import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
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
      <body className={`${bebasNeue.variable} ${dmSans.variable} font-sans antialiased bg-gradient-animated min-h-screen`}>
        {/* Noise texture overlay for vintage feel */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
