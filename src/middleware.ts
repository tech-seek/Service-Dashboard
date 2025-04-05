import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from './authConfig';
import { routes } from './routes';

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl, cookies } = req;
    const isLoggedIn = !!req.auth;
    const isProtectedRoutes = routes.protected.includes(nextUrl.pathname);
    const isAuthRoutes = nextUrl.pathname.startsWith(routes.auth);
    const isApiRoutes = nextUrl.pathname.startsWith(routes.api);
    const prevUrl = cookies.get('prevUrl')?.value ?? routes.base;

    if (!isLoggedIn && isProtectedRoutes) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (isLoggedIn && isAuthRoutes) {
        return NextResponse.redirect(new URL(prevUrl, nextUrl));
    }
    const response = NextResponse.next();
    if (!isAuthRoutes && !isApiRoutes) {
        // Set a very long expiration for the prevUrl cookie
        response.cookies.set('prevUrl', nextUrl.pathname, { 
            path: '/',
            maxAge: 365 * 24 * 60 * 60 * 10 // 10 years (effectively unlimited)
        });
    }

    return response;
});

export const config = {
    matcher: [
        // Exclude files with a "." followed by an extension, which are typically static files.
        // Exclude files in the _next directory, which are Next.js internals.
        '/((?!.+\\.[\\w]+$|_next).*)',
        // Re-include any files in the api or trpc folders that might have an extension
        '/(api|trpc)(.*)',
    ],
};
