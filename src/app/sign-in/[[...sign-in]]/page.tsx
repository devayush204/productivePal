
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | ProductivePal',
};

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
