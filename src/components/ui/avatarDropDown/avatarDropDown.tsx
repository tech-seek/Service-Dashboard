'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    updateLeftDaysCalculationSeviceAccunts,
    updateLeftDaysCalculationSeviceUsers,
} from '@/app/actions';
import { onLogoutAction } from '@/app/actions/login';
import { AddServiceBtn } from '@/app/dashboard/components/services';
import useShowToast from '@/app/hooks/useShowToast';
import ProfileSettings from '../sidebar/ProfileSettings';

const AvatarDropDown = ({ isAdmin }: { isAdmin?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();
    const { showToast } = useShowToast();
    const isHomePage = pathName === '/dashboard';
    const hanldeLogout = async () => {
        await onLogoutAction();
    };
    const handleUpdateLeftDays = async () => {
        const { error: errorAcc } = await updateLeftDaysCalculationSeviceAccunts();
        const { data, error } = await updateLeftDaysCalculationSeviceUsers();
        if (error) return showToast(false, error);
        if (errorAcc) return showToast(false, errorAcc);
        const message = (data as { message: string }).message;
        showToast(true, message);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
                        <Avatar className='cursor-pointer'>
                            <AvatarFallback>
                                <FaUser />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='*:cursor-pointer'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={'/dashboard/add-moderator'}>Add Moderator</Link>
                    </DropdownMenuItem>
                    {isHomePage && (
                        <DropdownMenuItem onClick={() => setIsOpen(true)}>
                            Add Section
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleUpdateLeftDays}>
                        Update Left Days
                    </DropdownMenuItem>
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <ProfileSettings />
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={hanldeLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AddServiceBtn isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default AvatarDropDown;
