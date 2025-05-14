
"use client";

import { useState, useEffect } from "react";
import { BaseWidget } from "./base-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useTaskStore, type Task, type Priority } from "@/store/task-store";
import { ListChecks, Trash2, Edit3, PlusCircle, AlertTriangle, Flag, CalendarDays } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";

const priorityIcons: Record<Priority, React.ReactNode> = {
  High: <Flag className="h-4 w-4 text-red-500" />,
  Medium: <Flag className="h-4 w-4 text-yellow-500" />,
  Low: <Flag className="h-4 w-4 text-green-500" />,
};

const priorityColors: Record<Priority, string> = {
  High: "border-red-500/50",
  Medium: "border-yellow-500/50",
  Low: "border-green-500/50",
};


function TaskForm({
  task,
  onSave,
  onClose,
}: {
  task?: Task;
  onSave: (taskData: Omit<Task, "id" | "completed">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [priority, setPriority] = useState<Priority>(task?.priority || "Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? parseISO(task.dueDate) : undefined
  );

  const handleSubmit = () => {
    if (!title.trim()) return; // Basic validation
    onSave({ title, priority, dueDate: dueDate?.toISOString() });
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Finish project report"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <DatePicker date={dueDate} setDate={setDueDate} />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogClose>
        <Button onClick={handleSubmit} disabled={!title.trim()}>Save Task</Button>
      </DialogFooter>
    </>
  );
}

export function TaskWidget() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion, getTaskById } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <BaseWidget title="Tasks" icon={<ListChecks className="text-primary" />}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </BaseWidget>
    );
  }

  const handleSaveTask = (taskData: Omit<Task, "id" | "completed">) => {
    if (editingTaskId) {
      updateTask(editingTaskId, taskData);
    } else {
      addTask(taskData);
    }
    setEditingTaskId(null);
  };

  const openEditForm = (id: string) => {
    setEditingTaskId(id);
    setIsFormOpen(true);
  }

  const openNewForm = () => {
    setEditingTaskId(null);
    setIsFormOpen(true);
  }
  
  const editingTask = editingTaskId ? getTaskById(editingTaskId) : undefined;

  const sortedTasks = [...tasks].sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : a.dueDate ? -1 : b.dueDate ? 1 : 0));


  return (
    <BaseWidget
      title="To-Do List"
      icon={<ListChecks className="text-primary h-5 w-5" />}
      headerActions={
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={openNewForm} className="text-primary hover:text-primary">
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
             <TaskForm 
                task={editingTask}
                onSave={handleSaveTask}
                onClose={() => setIsFormOpen(false)}
             />
          </DialogContent>
        </Dialog>
      }
    >
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
           <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No tasks yet!</p>
          <p className="text-sm text-muted-foreground mb-4">Click "Add" to create your first task.</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-0px)] pr-3"> {/* Adjust height as needed */}
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-md border transition-all",
                  task.completed ? "bg-muted/50 opacity-70" : "bg-card hover:shadow-md",
                  priorityColors[task.priority]
                )}
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <div className="flex-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                      task.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </label>
                  {task.dueDate && (
                    <p className={cn("text-xs text-muted-foreground flex items-center mt-1", task.completed && "line-through")}>
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {format(parseISO(task.dueDate), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {priorityIcons[task.priority]}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(task.id)}>
                    <Edit3 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                     <span className="sr-only">Edit task</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteTask(task.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </BaseWidget>
  );
}
