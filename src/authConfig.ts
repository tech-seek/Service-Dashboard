import { CredentialsSignin, NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { db } from '@/app/api/helpers';

const authConfig = {
    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/login',
    },
    providers: [
        CredentialProvider({
            async authorize(credentials) {
                try {
                    const { userName, password } = credentials;
                    if (!userName || !password || typeof password !== 'string')
                        throw new CredentialsSignin({
                            cause: 'Email and password are required',
                        });

                    const user = await db.user.findFirst({
                        where: { userName },
                    });
                    if (user?.password === null)
                        throw new CredentialsSignin({
                            cause: 'Invalid user name',
                        });

                    const isValid = password === user?.password;
                    if (!isValid)
                        throw new CredentialsSignin({
                            cause: 'Invalid  password',
                        });

                    return {
                        id: user.id,
                        name: user.userName,
                        email: '', // Add email if available
                        role: user.role,
                    };
                } catch (error) {
                    if (error instanceof CredentialsSignin) {
                        throw new CredentialsSignin({
                            cause: error.cause,
                        });
                    } else {
                        console.error('Unexpected error:', (error as Error).message);
                        return null;
                    }
                }
            },
        }),
    ],
} satisfies NextAuthConfig;
export default authConfig;
