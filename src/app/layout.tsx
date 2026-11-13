import type { Metadata } from "next";
import { Fragment_Mono } from "next/font/google";
import "./globals.css";

// The monospaced cut of Helvetica, so meta text and numbers share the body face's skeleton.
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
});

export const metadata: Metadata = {
  title: "Duang",
  description: "Duang 的作品站：Agent 拆解、后端与全栈笔记的入口。",
  icons: {
    icon: "/brand/duang-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${fragmentMono.variable} h-full`}>
      <body className="min-h-full bg-fog font-sans text-ink">{children}</body>
    </html>
  );
}
