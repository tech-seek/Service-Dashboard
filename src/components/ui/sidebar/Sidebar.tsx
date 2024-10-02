'use client';

import { usePathname } from 'next/navigation';
import React, { FC, ReactNode } from 'react';
import { SidebarAside, SmallerDeviceSidebar } from '.';
import { AvatarDropDown } from '../avatarDropDown';
import { CustomBreadcrumb } from '../customBreadcrumb';
import { GlobalSearch } from '../globalSearch';
import { ThemeSwitcher } from '../theme-switcher';

interface IProps {
    children: ReactNode;
    isAdmin?: boolean;
}

const Sidebar: FC<IProps> = ({ children, isAdmin }) => {
    const pathname = usePathname();
    return (
        <div className='flex min-h-dvh w-full flex-col bg-muted/40 sm:pl-16'>
            {/* sidebar aside component */}
            <SidebarAside pathName={pathname} isAdmin={isAdmin} />
            <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
                <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
                    {/* SmallerDeviceSidebar navigation  */}
                    <SmallerDeviceSidebar isAdmin={isAdmin} />
                    {/* bradCrumnb component */}
                    <CustomBreadcrumb pathName={pathname} />
                    {/* header components */}
                    <GlobalSearch />
                    <ThemeSwitcher />
                    {/* avatar DropdownMenu */}
                    <AvatarDropDown isAdmin={isAdmin} />
                </header>
            </div>
            {children}
        </div>
    );
};
export default Sidebar;
