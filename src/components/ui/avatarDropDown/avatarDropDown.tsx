'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { onLogoutAction } from '@/app/actions/login';
import { API_BASE_URL } from '@/app/config/env';
import { AddServiceBtn } from '@/app/dashboard/components/services';
import useShowToast from '@/app/hooks/useShowToast';
import ProfileSettings from '../sidebar/ProfileSettings';


const AvatarDropDown = ({ isAdmin }: { isAdmin?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();
    const session = useSession();
    const queryClient = useQueryClient();
    const { showToast } = useShowToast();
    const isHomePage = pathName === '/dashboard';
    const hanldeLogout = async () => {
        await onLogoutAction();
    };

    async function handleUpdateLeftDays() {
        try {
            const response = await fetch(`${API_BASE_URL}/update-left-days`, {
                method: 'POST',
            });
            const data = await response.json();
            queryClient.invalidateQueries({ queryKey: ['serviceUsers'] });
            queryClient.invalidateQueries({ queryKey: ['serviceAccounts'] });
            if (response.ok) {
                showToast(true, data.message);
            } else {
                showToast(false, data.error);
            }
        } catch (error) {
            showToast(false, 'Failed to update left days');
        }
    }
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
                    <DropdownMenuLabel>Name: {session?.data?.user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={'/dashboard/add-dealer'}>Add Dealer</Link>
                    </DropdownMenuItem>
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