
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/toaster"; // Keep Toaster if Providers doesn't include it

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProductivePal",
  description: "Your ultimate productivity dashboard and habit tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        >
          <Providers>
            {children}
          </Providers>
          {/* Toaster is often included in Providers or at a higher level, ensure it's rendered once */}
          {/* If Providers already includes Toaster, this can be removed */}
          {/* <Toaster /> */} 
        </body>
      </html>
    </ClerkProvider>
  );
}
