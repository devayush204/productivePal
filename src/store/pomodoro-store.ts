
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

interface PomodoroState {
  mode: PomodoroMode;
  timerActive: boolean;
  timeLeft: number; // in seconds
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsBeforeLongBreak: number;
  currentSessionCount: number;

  setMode: (mode: PomodoroMode) => void;
  toggleTimer: () => void;
  decrementTime: () => void;
  resetTimer: (resetCurrentSession?: boolean) => void;
  setDurations: (durations: {
    work?: number;
    short?: number;
    long?: number;
  }) => void;
  completeSession: () => void;
  skipTimer: () => void;
}

const DEFAULT_WORK_DURATION = 25;
const DEFAULT_SHORT_BREAK_DURATION = 5;
const DEFAULT_LONG_BREAK_DURATION = 15;

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      mode: "work",
      timerActive: false,
      timeLeft: DEFAULT_WORK_DURATION * 60,
      workDuration: DEFAULT_WORK_DURATION,
      shortBreakDuration: DEFAULT_SHORT_BREAK_DURATION,
      longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
      sessionsBeforeLongBreak: 4,
      currentSessionCount: 0,

      setMode: (mode) => {
        set({ timerActive: false, mode });
        if (mode === "work") set({ timeLeft: get().workDuration * 60 });
        else if (mode === "shortBreak")
          set({ timeLeft: get().shortBreakDuration * 60 });
        else if (mode === "longBreak")
          set({ timeLeft: get().longBreakDuration * 60 });
      },
      toggleTimer: () => set((state) => ({ timerActive: !state.timerActive })),
      decrementTime: () => {
        if (get().timeLeft > 0) {
          set((state) => ({ timeLeft: state.timeLeft - 1 }));
        } else {
          // Automatically complete session when time runs out
          set({ timerActive: false }); // Stop timer first
          get().completeSession();
        }
      },
      resetTimer: (resetCurrentSession = false) => {
        const currentMode = get().mode;
        let newTimeLeft = 0;
        if (currentMode === "work") newTimeLeft = get().workDuration * 60;
        else if (currentMode === "shortBreak") newTimeLeft = get().shortBreakDuration * 60;
        else if (currentMode === "longBreak") newTimeLeft = get().longBreakDuration * 60;
        
        set({ timeLeft: newTimeLeft, timerActive: false });
        if(resetCurrentSession && currentMode === 'work') {
          set({ currentSessionCount: 0 });
        }
      },
      setDurations: (durations) => {
        const oldWorkDuration = get().workDuration;
        const oldShortBreakDuration = get().shortBreakDuration;
        const oldLongBreakDuration = get().longBreakDuration;

        set((state) => ({
          workDuration: durations.work ?? state.workDuration,
          shortBreakDuration: durations.short ?? state.shortBreakDuration,
          longBreakDuration: durations.long ?? state.longBreakDuration,
        }));
        
        const currentMode = get().mode;
        if (currentMode === "work" && durations.work && durations.work !== oldWorkDuration) {
          set({ timeLeft: get().workDuration * 60, timerActive: false });
        }
        if (currentMode === "shortBreak" && durations.short && durations.short !== oldShortBreakDuration) {
          set({ timeLeft: get().shortBreakDuration * 60, timerActive: false });
        }
        if (currentMode === "longBreak" && durations.long && durations.long !== oldLongBreakDuration) {
          set({ timeLeft: get().longBreakDuration * 60, timerActive: false });
        }
      },
      completeSession: () => {
        const currentMode = get().mode;
        if (currentMode === "work") {
          const newSessionCount = get().currentSessionCount + 1;
          set({ currentSessionCount: newSessionCount });
          if (newSessionCount % get().sessionsBeforeLongBreak === 0) {
            get().setMode("longBreak");
          } else {
            get().setMode("shortBreak");
          }
        } else {
          get().setMode("work");
        }
      },
      skipTimer: () => {
        set({ timerActive: false });
        get().completeSession();
      }
    }),
    {
      name: "productive-pal-pomodoro",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
