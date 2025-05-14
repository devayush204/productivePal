
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Activity } from "lucide-react"; // Placeholder logo icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="md:hidden">
             <SidebarTrigger />
          </div>
          <Link href="/dashboard" className="flex items-center space-x-2 ml-2 md:ml-0">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-foreground">ProductivePal</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {/* User avatar/menu would go here with Clerk */}
        </div>
      </div>
    </header>
  );
}
