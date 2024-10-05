'use client'
import { NAV_LINKS } from '@/statics';
import Link from 'next/link';
import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '../icons';
import { usePathname } from 'next/navigation';

interface IProps {
    isAdmin?: boolean;
}
const SmallerDeviceSidebar: FC<IProps> = ({ isAdmin }) => {
    const pathName = usePathname()
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' variant='outline' className='sm:hidden'>
                    <Icons.PanelLeft className='h-5 w-5' />
                    <span className='sr-only'>Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className='sm:max-w-xs'>
                <nav className='flex flex-col justify-between w-full h-full text-lg font-medium'>
                    <div className='grid gap-6'>
                        {/* Map through navigation links */}
                        {NAV_LINKS.map(({ href, icon: Icon, label }) => {
                            const isHideHistoryBtn = !isAdmin && label === 'History';
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'flex items-center w-full gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                                        isHideHistoryBtn ? 'hidden' : '',
                                    )}
                                >
                                    <Icon  className={cn(
                                                'h-6 w-6',
                                                href === '/dashboard/expireing' ? 'text-red-300' : null,
                                                pathName === href && href === '/dashboard/expireing'
                                                    ? 'text-red-500'
                                                    : null,
                                            )} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Settings Link */}
                    {/* <Link
                        href='#'
                        className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                    >
                        <Icons.Settings className='h-5 w-5' />
                        Settings
                    </Link> */}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default SmallerDeviceSidebar;
