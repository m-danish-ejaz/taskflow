import type { Metadata } from "next";
import localFont from "next/font/local";
import "bootstrap-icons/font/bootstrap-icons.css"; // <- load bootstrap icons globally
import "./styles/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Poppins } from "next/font/google";
import DebugTools from "./components/shared/DebugTools";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // pick the weights you need
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  title: "TaskFlow Platform",
  description: "Micro-task freelancing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {children}
        {process.env.NEXT_PUBLIC_DEBUG === "true" && <DebugTools />}
      </body>
    </html>
  );
}
