
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | ProductivePal',
  description: 'Your personal productivity dashboard.',
};

export default function DashboardPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
        My Dashboard
      </h1>
      <DashboardGrid />
    </div>
  );
}
