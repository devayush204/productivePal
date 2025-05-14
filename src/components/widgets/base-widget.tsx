
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BaseWidgetProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  headerActions?: ReactNode;
}

export function BaseWidget({ title, children, className, icon, headerActions }: BaseWidgetProps) {
  return (
    <Card className={cn("h-full flex flex-col shadow-lg rounded-xl overflow-hidden border-primary/20", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4 bg-card">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
          {icon}
          {title}
        </CardTitle>
        {headerActions && <div className="flex items-center gap-1">{headerActions}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
