
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlusCircle, Target } from "lucide-react"; // Added Target icon

// Mock data for habits
const mockHabits = [
  { id: "1", name: "Morning Workout", frequency: "daily", completedToday: true, streak: 5 },
  { id: "2", name: "Read 30 Mins", frequency: "daily", completedToday: false, streak: 12 },
  { id: "3", name: "Drink 8 Glasses of Water", frequency: "daily", completedToday: true, streak: 2 },
  { id: "4", name: "Weekly Review", frequency: "weekly", completedToday: false, streak: 0 },
];

// Mock data for completed dates (replace with actual data logic)
// Key: YYYY-MM-DD, Value: Set of habit IDs completed on that day
const mockCompletions: Record<string, Set<string>> = {
  "2024-07-20": new Set(["1", "3"]),
  "2024-07-19": new Set(["1", "2", "3"]),
};


export function HabitTrackerContent() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [habits, setHabits] = useState(mockHabits); // Later use Zustand store

  // Effect to ensure client-side only code runs after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="space-y-6"><div className="h-96 bg-muted rounded-lg animate-pulse"></div><div className="h-64 bg-muted rounded-lg animate-pulse"></div></div>; // Or some skeleton
  }

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(h => 
        h.id === habitId ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak -1 : h.streak + 1 } : h
      )
    );
    // Here you would also update Firestore and completions for the selectedDate
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
             <Target className="mr-2 h-6 w-6" /> Habit Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            // Modifiers for highlighting completed days can be added here
            // e.g., modifiers={{ completed: datesWithCompletions }}
            // modifiersStyles={{ completed: { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-primary">Today's Habits</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
          </Button>
        </CardHeader>
        <CardContent>
          {habits.length > 0 ? (
            <ul className="space-y-3">
              {habits.filter(h => h.frequency === 'daily' || (h.frequency === 'weekly' && selectedDate && selectedDate.getDay() === 1 /* Assuming Monday for weekly */)).map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-md hover:shadow-sm transition-shadow"
                >
                  <div>
                    <p className="font-medium text-foreground">{habit.name}</p>
                    <p className="text-xs text-muted-foreground">Streak: {habit.streak} days</p>
                  </div>
                  <Button
                    variant={habit.completedToday ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={habit.completedToday ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                  >
                    {habit.completedToday && <CheckCircle2 className="mr-2 h-4 w-4" />}
                    {habit.completedToday ? "Completed" : "Mark Done"}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No habits tracked for today. Add some!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
