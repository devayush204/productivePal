
import { UserProfile } from "@clerk/nextjs";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile | ProductivePal',
};

export default function UserProfilePage() {
  return (
    <div className="flex justify-center items-start py-12 bg-background">
      <UserProfile path="/user-profile" routing="path" />
    </div>
  );
}

