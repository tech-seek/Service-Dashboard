import NextAuth from 'next-auth';
import authConfig from './authConfig';

export const { auth, handlers, signIn, signOut } = NextAuth({
    trustHost: true,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days   
    },
    ...authConfig,
});
