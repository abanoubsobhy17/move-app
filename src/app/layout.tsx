"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Provider } from "react-redux";
import { store } from "@/ib/store";
import Navbar from "@/app/_components/Navbar/Nav";
import { Toaster } from "sonner";
import Footer from "@/app/_components/Footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
        <Provider store={store}>
          <Navbar /> {/* ✅ إضافة الناف بار */}
          <Toaster richColors />
          <main className="pt-16">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
