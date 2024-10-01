import { Metadata } from 'next';
import React from 'react';
import { HistoryWrapper } from './components';
import { ISerchParams } from '@/types';


export const metadata: Metadata = {
    title: 'History',
};
const HistoryPage = ({ searchParams }: ISerchParams) => {
    return (
        <section className='container'>
            <HistoryWrapper searchParams={searchParams} />
        </section>
    );
};

export default HistoryPage;