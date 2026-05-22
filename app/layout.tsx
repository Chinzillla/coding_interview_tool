import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coding Interview Study Tool",
  description: "Spaced repetition dashboard and quiz tool for coding interview prep."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
