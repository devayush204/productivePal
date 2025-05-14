
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export function LandingHeader() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 20, delay: 0.2 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/landing" className="flex items-center space-x-2">
          <Activity className="h-7 w-7 text-primary" />
          <span className="font-bold text-2xl text-foreground">ProductivePal</span>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <SignedIn>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/landing" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" className="px-3 sm:px-4 text-sm sm:text-base">Login</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="px-3 sm:px-4 text-sm sm:text-base">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </motion.header>
  );
}
