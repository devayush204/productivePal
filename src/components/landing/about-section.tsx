
"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ListChecks, Target, Timer } from "lucide-react";

const features = [
  {
    icon: <Target className="h-10 w-10 text-primary mb-4" />,
    title: "Habit Tracking",
    description: "Build strong habits with our intuitive tracker. Visualize your progress and stay motivated on your journey to self-improvement.",
  },
  {
    icon: <ListChecks className="h-10 w-10 text-primary mb-4" />,
    title: "Task Management",
    description: "Organize your to-dos effortlessly. Set priorities, assign due dates, and never miss an important deadline again.",
  },
  {
    icon: <Timer className="h-10 w-10 text-primary mb-4" />,
    title: "Pomodoro Timer",
    description: "Boost focus and manage your work sessions effectively with the integrated Pomodoro timer for peak productivity.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-primary mb-4" />,
    title: "Seamless Experience",
    description: "Enjoy a smooth and delightful user experience with our beautifully designed and easy-to-use interface on all devices.",
  },
];

export function AboutSection() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-background my-12 md:my-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Why <span className="text-primary">ProductivePal</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide the tools you need to conquer your day, build lasting habits, and unlock your full potential. Focus on what matters most with an app designed for clarity and results.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-out bg-card border-border/50 hover:border-primary/50 flex flex-col text-center p-2 rounded-xl">
                <CardHeader className="items-center pt-6">
                  {feature.icon}
                  <CardTitle className="mt-2 text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
