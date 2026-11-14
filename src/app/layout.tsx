import type { Metadata } from "next";
import { DynaPuff, Fragment_Mono, Young_Serif } from "next/font/google";
import { themeBootScript } from "@/components/site/theme";
import "./globals.css";

// The monospaced cut of Helvetica, so meta text and numbers share the body face's skeleton.
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
});

// goopUI's bubbly display face, for the 多巴胺 and 粘液 themes.
const dynaPuff = DynaPuff({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-puff",
});

// A soft, ink-heavy serif for the 纸本 (risograph) theme.
const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
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
    <html
      lang="zh-CN"
      className={`${fragmentMono.variable} ${dynaPuff.variable} ${youngSerif.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before paint so a saved theme never flashes the default one first. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full bg-fog font-sans text-ink">{children}</body>
    </html>
  );
}
