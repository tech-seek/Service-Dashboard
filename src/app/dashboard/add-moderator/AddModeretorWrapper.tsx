/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import React, { FC, useState } from 'react';
import { TUserRespone } from '@/types/user';
import { createUserAction, deleteUserAction, editUserAction } from '@/app/actions/user';
import useShowToast from '@/app/hooks/useShowToast';
import { AddOptions } from '../components';
import { DataList } from '../components/DataList';
import { IListItem } from '../components/DataList/DataList';
import { ADD_MODERETOR_FORM_FIELDS } from '../static';


interface IProps {
    data: TUserRespone[] | null;
}

const AddModeretorWrapper: FC<IProps> = ({ data }) => {
    const { showToast } = useShowToast();
    // State to store seller data for optimistic updates
    const [moderatorData, setModeratorData] = useState<IListItem[]>(
        data
            ?.filter((user) => user.role !== 'admin')
            .map((user) => ({
                id: user.id,
                name: user.userName,
                password: user.password,
            })) ?? [],
    );

    // Handler for adding a new seller
    // Handler for adding a new seller
    const handleAdd = async (val: Record<string, unknown>) => {
        // Prepare the request body
        const newItem = val as unknown as IListItem;
        const body = {
            userName: newItem.name,
            password: newItem.password ?? '',
            role: 'moderator' as TUserRespone['role'],
        };

        // Optimistically add the new item to the UI
        const previousData = moderatorData;
        const tempId = Date.now().toString(); // Generate a temporary ID for optimistic update
        const optimisticNewItem = { ...newItem, id: tempId };

        setModeratorData((prevData) => [...prevData, optimisticNewItem]);

        const { data, error } = await createUserAction(body);
        if (error) {
            setModeratorData(previousData);
            return showToast(false, error);
        }
        const message = (data as { message: string }).message;
        showToast(true, message);
    };

    // Handler for deleting a seller
    const handleDelete = async (id: string) => {
        // Optimistically remove the seller from the UI
        const previousData = moderatorData;
        setModeratorData((prevData) => prevData.filter((seller) => seller.id !== id));

        const { data, error } = await deleteUserAction(id);
        if (error) {
            setModeratorData(previousData);
            return showToast(false, error);
        }
        const message = (data as { message: string }).message;
        showToast(true, message);
    };

    // Handler for editing a seller
    const handleEdit = async (updatedItem: IListItem) => {
        const previousData = moderatorData;
        if ('name' in updatedItem && 'password' in updatedItem) {
            const body = {
                userName: updatedItem.name,
                password: updatedItem.password ?? '',
                role: 'moderator' as TUserRespone['role'],
            };
            // Optimistically update the UI
            setModeratorData((prevData) =>
                prevData.map((seller) => (seller.id === updatedItem.id ? updatedItem : seller)),
            );

            const { data, error } = await editUserAction(updatedItem.id, body);
            if (error) {
                setModeratorData(previousData);
                return showToast(false, error);
            }
            const message = (data as { message: string }).message;
            showToast(true, message);
        }
    };

    return (
        <section className='space-y-5 sm:space-y-10 p-5'>
            <AddOptions
                fromFields={ADD_MODERETOR_FORM_FIELDS}
                onHandleSubmit={(val: Record<string, unknown>) => handleAdd(val)}
            />
            <DataList
                heading='Moderator List'
                data={moderatorData}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </section>
    );
};

export default AddModeretorWrapper;