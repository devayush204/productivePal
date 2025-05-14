
import type { Layout } from "react-grid-layout";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WidgetLayout extends Layout {
  id: string; 
}

interface LayoutState {
  layouts: { [breakpoint: string]: WidgetLayout[] };
  setLayouts: (layouts: { [breakpoint: string]: WidgetLayout[] }) => void;
  updateLayout: (breakpoint: string, newLayout: WidgetLayout[]) => void;
}

const initialLayouts: { [key: string]: WidgetLayout[] } = {
  lg: [
    { i: "tasks", x: 0, y: 0, w: 6, h: 9, minW: 3, minH: 4, id: "tasks" },
    { i: "pomodoro", x: 6, y: 0, w: 3, h: 5, minW: 2, minH: 3, id: "pomodoro" },
    { i: "quote", x: 9, y: 0, w: 3, h: 5, minW: 2, minH: 3, id: "quote" },
  ],
  md: [
    { i: "tasks", x: 0, y: 0, w: 5, h: 9, minW: 3, minH: 4, id: "tasks" },
    { i: "pomodoro", x: 5, y: 0, w: 5, h: 5, minW: 2, minH: 3, id: "pomodoro" },
    { i: "quote", x: 0, y: 9, w: 5, h: 5, minW: 2, minH: 3, id: "quote" },
  ],
  sm: [
    { i: "tasks", x: 0, y: 0, w: 6, h: 8, minW: 3, minH: 4, id: "tasks" },
    { i: "pomodoro", x: 0, y: 8, w: 3, h: 5, minW: 2, minH: 3, id: "pomodoro" },
    { i: "quote", x: 3, y: 8, w: 3, h: 5, minW: 2, minH: 3, id: "quote" },
  ],
  xs: [
    { i: "tasks", x: 0, y: 0, w: 4, h: 8, minW: 2, minH: 4, id: "tasks" },
    { i: "pomodoro", x: 0, y: 8, w: 4, h: 5, minW: 2, minH: 3, id: "pomodoro" },
    { i: "quote", x: 0, y: 13, w: 4, h: 5, minW: 2, minH: 3, id: "quote" },
  ],
   xxs: [
    { i: "tasks", x: 0, y: 0, w: 2, h: 8, minW: 2, minH: 4, id: "tasks" },
    { i: "pomodoro", x: 0, y: 8, w: 2, h: 5, minW: 2, minH: 3, id: "pomodoro" },
    { i: "quote", x: 0, y: 13, w: 2, h: 5, minW: 2, minH: 3, id: "quote" },
  ],
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layouts: initialLayouts,
      setLayouts: (layouts) => set({ layouts }),
      updateLayout: (breakpoint, newLayout) => {
        set((state) => ({
          layouts: {
            ...state.layouts,
            [breakpoint]: newLayout.map(l => ({...l, id: l.i})), // Ensure id is populated
          },
        }));
      }
    }),
    {
      name: "productive-pal-layouts",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
