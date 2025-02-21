import { ISearchParams } from '@/types';
import { Metadata } from 'next';
import React from 'react';
import { ServiceAccountsExpireTable } from './components';


export const metadata: Metadata = {
    title: 'Service Accounts Expiring',
};
const ExpiringPage = ({ searchParams }: ISearchParams) => {
    return <ServiceAccountsExpireTable searchParams={searchParams} />;
};

export default ExpiringPage;