import { auth } from '@/auth';
import { ISerchParams } from '@/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';
import { isAdminAction } from '@/app/actions/user';
import { HistoryWrapper } from './components';

export const metadata: Metadata = {
    title: 'History',
};
const HistoryPage = async ({ searchParams }: ISerchParams) => {
    const isAdmin = await isAdminAction();
    if (!isAdmin) redirect('/');
    return (
        <section className='container'>
            <HistoryWrapper searchParams={searchParams} />
        </section>
    );
};

export default HistoryPage;
