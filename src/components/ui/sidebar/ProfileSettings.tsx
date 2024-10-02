'use client';

import { useSession } from 'next-auth/react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { onLogoutAction } from '@/app/actions/login';
import { editUserAction, getUserByNameAction } from '@/app/actions/user';
import useShowToast from '@/app/hooks/useShowToast';

interface IAdmin {
    id?: string;
    name: string;
    password: string;
}

interface IProps extends ButtonProps {}

const ProfileSettings: FC<IProps> = ({ className, ...rest }) => {
    const [admin, setAdmin] = useState<IAdmin>({ id: '', name: '', password: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editValues, setEditValues] = useState<IAdmin>({ name: '', password: '' });
    const session = useSession();
    const { showToast } = useShowToast();
    const hanldeLogout = async () => {
        await onLogoutAction();
    };
    const handleSave = useCallback(async () => {
        if (admin.name !== editValues.name || admin.password !== editValues.password) {
            const { error } = await editUserAction(admin.id ?? '', {
                userName: editValues.name,
                password: editValues.password,
                role: 'admin',
            });
            if (error) {
                showToast(false, 'Failed to update Admin profile. Please try again later.');
                setIsDialogOpen(false);
                return;
            }
            hanldeLogout();
            showToast(true, 'Admin profile updated successfully.');
            setIsDialogOpen(false);
        }
    }, [admin.id, admin.name, admin.password, editValues.name, editValues.password, showToast]);

    const handleChange = useCallback((key: keyof IAdmin, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    }, []);

    useEffect(() => {
        const getAdmin = async () => {
            try {
                const user = await getUserByNameAction(session?.data?.user?.name ?? '');
                if (user) {
                    setAdmin({
                        id: user.id,
                        name: user.userName ?? '',
                        password: user.password ?? '',
                    });
                    setEditValues({
                        name: user.userName ?? '',
                        password: user.password ?? '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        void getAdmin();
    }, [session, session?.data?.user?.name]);

    return (
        <>
            <button
                {...rest}
                className={cn('w-full', className)}
                onClick={() => setIsDialogOpen(true)}
            >
                Profile Settings
            </button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogDescription className='sr-only'>Edit profile</DialogDescription>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <Label>User Name</Label>
                    <Input
                        type='text'
                        value={editValues.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className='mb-4'
                        placeholder='Edit username'
                    />
                    <Label>Password</Label>
                    <Input
                        type='text'
                        value={editValues.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className='mb-4'
                        placeholder='Edit password'
                    />
                    <div className='flex justify-end gap-2'>
                        <button
                            className='px-4 py-2 bg-gray-200 text-gray-700 rounded'
                            onClick={() => setIsDialogOpen(false)}
                            aria-label='Cancel editing profile'
                        >
                            Cancel
                        </button>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={handleSave}
                            aria-label='Save profile changes'
                        >
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default React.memo(ProfileSettings);
