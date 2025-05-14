
import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Header } from "./header";
import { SidebarNav } from "./sidebar-nav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarContent className="p-2">
              <SidebarNav />
            </SidebarContent>
          </Sidebar>
          <SidebarRail />
          <SidebarInset className="flex-1 bg-background">
            <main className="container mx-auto max-w-full p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
