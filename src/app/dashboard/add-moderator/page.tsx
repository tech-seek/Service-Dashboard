import { getUsers } from '@/http';
import { Metadata } from 'next';
import React from 'react';
import AddModeretorWrapper from './AddModeretorWrapper';

export const metadata: Metadata = {
    title: 'Add Moderator',
};
const AddSellerPage = async () => {
    const res = await getUsers();
    if (!res) {
        // Handle the case where res is null or undefined
        return <div>Error: Unable to fetch sellers</div>;
    }
    return <AddModeretorWrapper data={res.data} />;
};
export default AddSellerPage;
