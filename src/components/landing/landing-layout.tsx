
import type { ReactNode } from 'react';
import { LandingHeader } from './landing-header';
import { LandingFooter } from './landing-footer';

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-grow">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
