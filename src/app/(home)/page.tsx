import { ISerchParams } from '@/types';
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import HomeWrapper from './components/HomeWrapper';
import { isAdminAction } from '../actions/user';


const HomePage = async ({ searchParams }: ISerchParams) => {
     const isAdmin = await isAdminAction();
    return (
        <Sidebar isAdmin={isAdmin}>
            <HomeWrapper searchParams={searchParams} />
        </Sidebar>
    );
};

export default HomePage;