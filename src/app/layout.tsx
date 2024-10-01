import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import QueryClientProvider from '@/provider/query-client-provider';
import { ThemeProvider } from '@/provider/theme-provider';
import SearchQueryProvider from '@/provider/use-search-provider';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: 'Service Dashboard',
    description: 'this is a service dashboard to monitor and maintan the services and their users',
    icons: {
        icon: '/favicon.svg',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang='en'>
            <head />
            <body className={`${poppins.variable} antialiased`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                    <SessionProvider session={session}>
                        <QueryClientProvider>
                            <SearchQueryProvider>
                                {children}
                                <Toaster />
                            </SearchQueryProvider>
                        </QueryClientProvider>
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
