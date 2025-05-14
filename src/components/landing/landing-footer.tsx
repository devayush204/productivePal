
"use client";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function LandingFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="border-t py-8 bg-background"
    >
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center items-center mb-4">
          <Activity className="h-6 w-6 text-primary mr-2" />
          <span className="font-semibold text-lg text-foreground">ProductivePal</span>
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} ProductivePal. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Crafted to help you achieve more, one task at a time.
        </p>
      </div>
    </motion.footer>
  );
}
