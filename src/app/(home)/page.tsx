import { ISearchParams } from '@/types';
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { isAdminAction } from '../actions/user';
import HomeWrapper from './components/HomeWrapper';

const HomePage = async ({ searchParams }: ISearchParams) => {
    const isAdmin = await isAdminAction();
    return (
        <Sidebar isAdmin={isAdmin}>
            <HomeWrapper searchParams={searchParams} />
        </Sidebar>
    );
};

export default HomePage;
