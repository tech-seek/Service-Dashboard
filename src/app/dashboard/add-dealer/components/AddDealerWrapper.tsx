'use client';

import React, { FC, useState } from 'react';
import { TDealerResponse } from '@/types/dealer';
import { createDealerAction, deleteDealerAction, editDealerAction } from '@/app/actions/dealer';
import useShowToast from '@/app/hooks/useShowToast';
import { AddOptions, DataList } from '../../components';
import { ADD_DEALER_FORM_FIELDS } from '../static';

interface IProps {
    data: TDealerResponse[];
}
const AddDealerWrapper: FC<IProps> = ({ data }) => {
    const { showToast } = useShowToast();

    // State to store dealer data for optimistic updates
    const [dealerData, setDealerData] = useState<TDealerResponse[]>(data ?? []);
    // Handler for adding a new dealer
    const handleAdd = async (val: Record<string, unknown>) => {
        const newItem = val as unknown as TDealerResponse;
        const body = {
            name: newItem.name,
        };

        const previousData = dealerData;
        const tempId = Date.now().toString();
        const optimisticNewItem = { ...newItem, id: tempId };

        setDealerData((prevData) => [...prevData, optimisticNewItem]);

        const { data, error } = await createDealerAction(body);
        if (error) {
            setDealerData(previousData);
            return showToast(false, error);
        }
        const message = (data as { message: string }).message;
        showToast(true, message);
    };

    // Handler for deleting a dealer
    const handleDelete = async (id: string) => {
        const previousData = dealerData;
        setDealerData((prevData) => prevData.filter((dealer) => dealer.id !== id));

        const { data, error } = await deleteDealerAction(id);
        if (error) {
            setDealerData(previousData);
            return showToast(false, error);
        }
        const message = (data as { message: string }).message;
        showToast(true, message);
    };

    // Handler for editing a dealer
    const handleEdit = async (updatedItem: TDealerResponse) => {
        const previousData = dealerData;
        if ('name' in updatedItem) {
            const body = {
                name: updatedItem.name,
            };

            setDealerData((prevData) =>
                prevData.map((dealer) => (dealer.id === updatedItem.id ? updatedItem : dealer)),
            );

            const { data, error } = await editDealerAction(updatedItem.id, body);
            if (error) {
                setDealerData(previousData);
                return showToast(false, error);
            }
            const message = (data as { message: string }).message;
            showToast(true, message);
        }
    };

    return (
        <section className='space-y-5 sm:space-y-10 p-5'>
            <AddOptions
                fromFields={ADD_DEALER_FORM_FIELDS}
                onHandleSubmit={(val: Record<string, unknown>) => handleAdd(val)}
            />
            <DataList
                heading='Dealer List'
                data={dealerData}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isDealerPage
            />
        </section>
    );
};

export default AddDealerWrapper;
