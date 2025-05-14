
import { LandingLayout } from '@/components/landing/landing-layout';
import { HeroSection } from '@/components/landing/hero-section';
import { AboutSection } from '@/components/landing/about-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to ProductivePal',
  description: 'Boost your productivity with ProductivePal. Track habits, manage tasks, and stay focused.',
};

export default function LandingPage() {
  return (
    <LandingLayout>
      <HeroSection />
      <AboutSection />
    </LandingLayout>
  );
}
