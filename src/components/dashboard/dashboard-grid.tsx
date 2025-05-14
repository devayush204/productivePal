
"use client";

import { useEffect, useState } from "react";
import { Responsive, WidthProvider, type Layouts, type Layout } from "react-grid-layout";
import { useLayoutStore, type WidgetLayout } from "@/store/layout-store";
import { TaskWidget } from "@/components/widgets/task-widget";
import { PomodoroWidget } from "@/components/widgets/pomodoro-widget";
import { QuoteWidget } from "@/components/widgets/quote-widget";

// Import react-grid-layout and react-resizable CSS
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { cn } from "@/lib/utils";

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents: { [key: string]: React.ComponentType } = {
  tasks: TaskWidget,
  pomodoro: PomodoroWidget,
  quote: QuoteWidget,
};

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

export function DashboardGrid() {
  const { layouts, updateLayout, setLayouts: setStoreLayouts } = useLayoutStore();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure layouts in store have the 'id' field correctly mapped from 'i'
    // This could happen if older persisted data doesn't have 'id'
    const sanitizedLayouts: Layouts = {};
    let changed = false;
    for (const bp in layouts) {
      sanitizedLayouts[bp] = layouts[bp].map(l => {
        if (!l.id && l.i) {
          changed = true;
          return { ...l, id: l.i };
        }
        return l;
      });
    }
    if (changed) {
       setStoreLayouts(sanitizedLayouts as { [breakpoint: string]: WidgetLayout[] });
    }

  }, [layouts, setStoreLayouts]);


  const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
     // `allLayouts` provides layouts for all breakpoints after a drop/resize.
     // We should update the store with the specific breakpoint's layout that changed.
     // `currentLayout` is the layout for the current breakpoint.
    if (mounted) { // Prevent updates on initial mount if not desired
        updateLayout(currentBreakpoint, currentLayout as WidgetLayout[]);
    }
  };

  const onBreakpointChange = (newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint);
  };
  
  if (!mounted) {
    // Render skeleton or loading state for SSR, or null
    // RGL needs to measure width, so it's client-side only effectively
    return <div className="min-h-[600px] bg-muted rounded-lg animate-pulse"></div>;
  }


  // Ensure that layouts passed to RGL are up-to-date from the store
  const currentLayoutsForRGL: Layouts = {};
   Object.keys(layouts).forEach(bp => {
    currentLayoutsForRGL[bp] = layouts[bp].map(l => ({...l, i: l.id || l.i})); // Ensure 'i' is always present
  });


  const definedWidgetKeys = Object.keys(widgetComponents);
  const validLayouts: Layouts = {};
  Object.entries(currentLayoutsForRGL).forEach(([bp, bpLayouts]) => {
    validLayouts[bp] = bpLayouts.filter(l => definedWidgetKeys.includes(l.i));
  });


  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={validLayouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={50} // Adjust as needed
      draggableHandle=".widget-drag-handle" // Optional: class for drag handle
      onLayoutChange={onLayoutChange}
      onBreakpointChange={onBreakpointChange}
      isDraggable={true}
      isResizable={true}
      compactType="vertical"
      useCSSTransforms={true}
      measureBeforeMount={false} // RGL can measure itself
    >
      {validLayouts[currentBreakpoint]?.map((widgetLayout) => {
        const WidgetComponent = widgetComponents[widgetLayout.i];
        if (!WidgetComponent) return null;
        return (
          <div key={widgetLayout.i} data-grid={widgetLayout} className={cn("bg-card rounded-xl overflow-hidden shadow-md")}>
            {/* The BaseWidget is now part of each specific widget to handle its own title/icon */}
            <WidgetComponent />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
