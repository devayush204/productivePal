
import { HabitTrackerContent } from "@/components/habits/habit-tracker-content";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Habit Tracker | ProductivePal',
  description: 'Track your habits and build streaks.',
};

export default function HabitsPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
        Habit Tracker
      </h1>
      <HabitTrackerContent />
    </div>
  );
}
