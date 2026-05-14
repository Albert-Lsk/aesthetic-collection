import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aesthetic Collection",
  description: "A curated navigation library of aesthetic and design inspiration websites."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
