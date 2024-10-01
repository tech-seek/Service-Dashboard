import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '../icons';
import { NAV_LINKS } from '@/statics';


const SmallerDeviceSidebar = () => {
   
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' variant='outline' className='sm:hidden'>
                    <Icons.PanelLeft className='h-5 w-5' />
                    <span className='sr-only'>Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className='sm:max-w-xs'>
                <nav className='flex flex-col justify-between h-full text-lg font-medium'>
                    <div className='grid gap-6'>
                        {/* Map through navigation links */}
                        {NAV_LINKS.map(({ href, icon: Icon, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                            >
                                <Icon className='h-5 w-5' />
                                {label}
                            </Link>
                        ))}
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