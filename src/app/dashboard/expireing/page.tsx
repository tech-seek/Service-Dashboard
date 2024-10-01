import { Metadata } from 'next';
import React from 'react';
import { ServiceAccountsExpireTable } from './components';
import { ISerchParams } from '@/types';

export const metadata: Metadata = {
    title: 'Service Accounts Expireing',
};
const ExpireingPage = ({ searchParams }: ISerchParams) => {
    return <ServiceAccountsExpireTable searchParams={searchParams} />;
};

export default ExpireingPage;
