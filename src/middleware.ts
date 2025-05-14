
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/habits(.*)',
  '/user-profile(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)', // Allow webhook to be public
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  if (isPublicRoute(req)) {
    return; // Skip auth check for public routes
  }
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
