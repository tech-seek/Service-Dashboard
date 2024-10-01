import { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { isAdminAction } from '../actions/user';

export const metadata: Metadata = {
    title: {
        default: 'Dashboard',
        template: '%s | Dashboard',
    },
};
const DashboardLayout = async({ children }: { children: ReactNode }) => {
    const isAdmin = await isAdminAction();
    return (
        <main>
            <Sidebar isAdmin={isAdmin}>{children}</Sidebar>
        </main>
    );
};

export default DashboardLayout;
