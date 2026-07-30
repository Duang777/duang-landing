import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duang",
  description: "Duang 的公开笔记本。",
  icons: {
    icon: "/brand/duang-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[var(--paper)] font-sans text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
