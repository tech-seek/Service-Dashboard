'use client';

import React, { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';

interface IDealer {
    id: string;
    name: string;
}

interface EditDealerDataProps {
    dealer: IDealer;
    onEdit: (updatedDealer: IDealer) => void;
}

const EditDealerData: FC<EditDealerDataProps> = ({ dealer, onEdit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editValues, setEditValues] = useState({ name: dealer.name});

    const handleSave = () => {
        const updatedDealer = { ...dealer, name: editValues.name};
        onEdit(updatedDealer);
        setIsDialogOpen(false); // Close dialog after saving
    };

    const handleChange = (key: string, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className='flex gap-2 items-center'>
            {/* Edit Icon to trigger dialog */}
            <Icons.Pencil
                className='text-blue-500 cursor-pointer'
                onClick={() => setIsDialogOpen(true)}
            />

            {/* Dialog for editing Dealer */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Dealer</DialogTitle>
                    </DialogHeader>

                    <Input
                        type='text'
                        value={editValues.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className='mb-4'
                        placeholder='Edit Dealername'
                    />
                    <div className='flex justify-end gap-2'>
                        <button
                            className='px-4 py-2 bg-gray-200 text-gray-700 rounded'
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditDealerData;
