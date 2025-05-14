
"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="md:pr-8"
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5}}
          >
            Elevate Your <span className="text-primary">Productivity</span>. Effortlessly.
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7}}
          >
            ProductivePal helps you build habits, manage tasks, and stay focused with our intuitive tools. Start achieving your goals today.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9}}
          >
            <SignedIn>
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow">Get Started Free</Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 shadow-md hover:shadow-accent/20 transition-shadow">Login</Button>
              </SignInButton>
            </SignedOut>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="relative h-72 md:h-[450px] rounded-xl overflow-hidden shadow-2xl mt-8 md:mt-0"
        >
          <Image
            src="https://placehold.co/700x500.png"
            alt="Productivity Dashboard Mockup"
            layout="fill"
            objectFit="cover"
            data-ai-hint="productivity app mockup"
            priority
            className="rounded-xl"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
        </motion.div>
      </div>
    </section>
  );
}
