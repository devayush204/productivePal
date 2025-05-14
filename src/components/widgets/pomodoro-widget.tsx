
"use client";

import { useEffect, useState, useCallback } from "react";
import { BaseWidget } from "./base-widget";
import { Button } from "@/components/ui/button";
import { usePomodoroStore } from "@/store/pomodoro-store";
import { Timer, Play, Pause, RotateCcw, SkipForward, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

function PomodoroSettingsDialog({ children }: { children: React.ReactNode }) {
  const { workDuration, shortBreakDuration, longBreakDuration, setDurations } = usePomodoroStore();
  const [localWork, setLocalWork] = useState(workDuration);
  const [localShort, setLocalShort] = useState(shortBreakDuration);
  const [localLong, setLocalLong] = useState(longBreakDuration);

  const handleSave = () => {
    setDurations({ work: localWork, short: localShort, long: localLong });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="work-duration" className="text-right col-span-2">Work (min)</Label>
            <Input id="work-duration" type="number" value={localWork} onChange={(e) => setLocalWork(parseInt(e.target.value, 10) || 0)} className="col-span-2" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="short-break-duration" className="text-right col-span-2">Short Break (min)</Label>
            <Input id="short-break-duration" type="number" value={localShort} onChange={(e) => setLocalShort(parseInt(e.target.value, 10) || 0)} className="col-span-2" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="long-break-duration" className="text-right col-span-2">Long Break (min)</Label>
            <Input id="long-break-duration" type="number" value={localLong} onChange={(e) => setLocalLong(parseInt(e.target.value, 10) || 0)} className="col-span-2" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSave}>Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export function PomodoroWidget() {
  const {
    mode,
    timerActive,
    timeLeft,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    toggleTimer,
    decrementTime,
    resetTimer,
    skipTimer,
    currentSessionCount,
    sessionsBeforeLongBreak
  } = usePomodoroStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !timerActive) return;

    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, timerActive, decrementTime]);

  const totalDuration =
    mode === "work"
      ? workDuration * 60
      : mode === "shortBreak"
      ? shortBreakDuration * 60
      : longBreakDuration * 60;
  
  const progressPercentage = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  const modeText = {
    work: "Focus Time",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  const modeColors = {
    work: "bg-primary",
    shortBreak: "bg-accent",
    longBreak: "bg-green-500", // A different green for long break
  }

  if (!mounted) {
     return (
      <BaseWidget title="Pomodoro" icon={<Timer className="text-primary" />}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading timer...</p>
        </div>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget title="Pomodoro Timer" icon={<Timer className="text-primary h-5 w-5" />}
      headerActions={
        <PomodoroSettingsDialog>
           <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary">
              <Settings2 className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
        </PomodoroSettingsDialog>
      }
    >
      <div className="flex flex-col items-center justify-around h-full text-center">
        <div className={cn("px-4 py-1 rounded-full text-sm font-medium", modeColors[mode], mode === 'shortBreak' ? 'text-accent-foreground' : 'text-primary-foreground')}>
          {modeText[mode]}
        </div>
        
        <div className="my-4">
          <p className="text-6xl font-bold font-mono text-foreground tabular-nums">
            {formatTime(timeLeft)}
          </p>
        </div>

        <div className="w-full px-4">
          <Progress value={progressPercentage} className="h-3 mb-2" indicatorClassName={modeColors[mode]} />
           <p className="text-xs text-muted-foreground">
            Session {mode === 'work' ? `${currentSessionCount + 1}/${sessionsBeforeLongBreak}` : ''}
          </p>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" size="icon" onClick={() => resetTimer()} aria-label="Reset timer">
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            className={cn("px-8", timerActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-primary hover:bg-primary/90")}
            onClick={toggleTimer}
            aria-label={timerActive ? "Pause timer" : "Start timer"}
          >
            {timerActive ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
            {timerActive ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" size="icon" onClick={skipTimer} aria-label="Skip current session">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </BaseWidget>
  );
}
