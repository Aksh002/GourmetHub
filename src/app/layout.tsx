import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Dining - Restaurant Management System",
  description: "A modern restaurant management system with online ordering capabilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>
          <Header />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
} 