import NextAuth from 'next-auth';
import authConfig from './authConfig';

export const { auth, handlers, signIn, signOut } = NextAuth({
    trustHost: true,
    session: {
        strategy: 'jwt',
        maxAge: 365 * 24 * 60 * 60 * 10, // 10 years (effectively unlimited)
    },
    jwt: {
        maxAge: 365 * 24 * 60 * 60 * 10, // 10 years (effectively unlimited)
    },
    ...authConfig,
});
