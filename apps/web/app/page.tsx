import { redirect } from 'next/navigation';
import LandingPage from './landing-page';

export default async function Home() {
  try {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    if (session) redirect('/dashboard');
  } catch {
    // Auth unavailable — show landing page
  }
  return <LandingPage />;
}
