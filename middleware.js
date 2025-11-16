import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public: home, menu, contact, about, sign-in/up
// Protect only sensitive pages like orders and reservations
const isProtectedRoute = createRouteMatcher([
  '/orders(.*)',
  '/myOrders(.*)',
  '/reservations(.*)',
  '/myReservations(.*)',
  '/checkout(.*)',
  '/cart(.*)',
])


export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}