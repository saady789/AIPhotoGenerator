import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Appbar } from "@/components/ui/Appbar"; // ✅ import here

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "PhotoAI",
  description: "Generate photos on the go",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900 min-h-screen`}
        >
          <Appbar /> {/* ✅ Add this line */}
          <main className="pt-16">{children}</main>
        </body>
      </ClerkProvider>
    </html>
  );
}
