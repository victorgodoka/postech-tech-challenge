"use client";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { ReduxProvider } from "@/store/provider";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body className={`${geistSans.variable} antialiased`}>
          <ToastContainer />
          {children}
        </body>
      </ReduxProvider>
    </html>
  );
}
