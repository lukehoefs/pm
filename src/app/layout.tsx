import type { Metadata } from "next";
import { Bebas_Neue, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: BRAND.name,
  description: `Projects, quotes, and submittal packages for ${BRAND.name} — waterworks distribution since ${BRAND.established}.`,
  icons: { icon: "/pps-logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${bebasNeue.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
