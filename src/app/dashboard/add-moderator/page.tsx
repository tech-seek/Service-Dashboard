
import { Metadata } from 'next';
import React from 'react';
import AddSellerContainer from './AddModeretorContainer';
import { getUsers } from '@/http';

export const metadata: Metadata = {
    title: 'Add Moderator',
};
const AddSellerPage = async () => {
    const res = await getUsers();
    if (!res) {
        // Handle the case where res is null or undefined
        return <div>Error: Unable to fetch sellers</div>;
    }
    return <AddSellerContainer data={res.data} />;
};
export default AddSellerPage;
