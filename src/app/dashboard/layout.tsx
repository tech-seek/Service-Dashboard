import { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/sidebar';

export const metadata: Metadata = {
    title: {
        default: 'Dashboard',
        template: '%s | Dashboard',
    },
};
const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main>
            <Sidebar>{children}</Sidebar>
        </main>
    );
};

export default DashboardLayout;
