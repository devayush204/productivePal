
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | ProductivePal',
};

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
