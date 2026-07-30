import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duang 的 Agent、后端与全栈工程笔记",
  description:
    "Duang 的公开工程笔记：Agent 项目拆解、后端机制、前端实验与全栈学习。",
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--paper)] font-sans text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
