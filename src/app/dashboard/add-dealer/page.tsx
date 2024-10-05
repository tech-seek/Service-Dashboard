import { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { TDealerResponse } from '@/types/dealer';
import { tryCatch } from '@/lib/trycatch';
import { AddDealerWrapper } from './components';

export const metadata: Metadata = {
    title: 'Add Dealer',
};
type TDealerGetResponse = {
    message: ReactNode;
    data: TDealerResponse[];
};
const AddDealerPage = async () => {
    const [response, error] = (await tryCatch('dealers')) as TDealerGetResponse[];
    if (error) return <div>{error.message}</div>;
    return <AddDealerWrapper data={response?.data} />;
};

export default AddDealerPage;
