import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import HomeWrapper from './components/HomeWrapper';
import { ISerchParams } from '@/types';


const HomePage = ({ searchParams }: ISerchParams) => {
    return (
        <Sidebar>
            <HomeWrapper searchParams={searchParams} />
        </Sidebar>
    );
};

export default HomePage;