
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/landing'); // Change redirect to /landing
  return null;
}
