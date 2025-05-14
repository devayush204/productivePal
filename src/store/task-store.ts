
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate?: string; // Store as ISO string
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [
        // Sample initial tasks
        { id: crypto.randomUUID(), title: "Setup project environment", priority: "High", dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), completed: true },
        { id: crypto.randomUUID(), title: "Design dashboard layout", priority: "Medium", dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), completed: false },
        { id: crypto.randomUUID(), title: "Implement task widget", priority: "High", completed: false },
      ],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: crypto.randomUUID(), completed: false },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      getTaskById: (id) => get().tasks.find(task => task.id === id),
    }),
    {
      name: "productive-pal-tasks",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
