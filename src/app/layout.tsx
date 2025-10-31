import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-google-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Destined",
  description: "Online dating app to find your perfect match.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="auto">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
