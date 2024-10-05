import { NAV_LINKS, TOOL_TIP_DELAY } from '@/statics';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import Link from 'next/link';
import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface IProps {
    isAdmin?: boolean;
    pathName: string;
}
const SidebarAside: FC<IProps> = ({ pathName, isAdmin }) => {
    return (
        <aside className='fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex '>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-4'>
                {NAV_LINKS.map(({ href, icon: Icon, label }) => {
                    const isHideHistoryBtn = !isAdmin && label === 'History';
                    return (
                        <TooltipProvider key={href} delayDuration={TOOL_TIP_DELAY}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={href}
                                        className={cn(
                                            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                                            pathName === href
                                                ? 'text-primary'
                                                : 'text-muted-foreground',
                                            isHideHistoryBtn ? 'hidden' : '',
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'h-6 w-6',
                                                href === '/dashboard/expireing' ? 'text-red-300' : null,
                                                pathName === href && href === '/dashboard/expireing'
                                                    ? 'text-red-500'
                                                    : null,
                                            )}
                                        />
                                        <span className='sr-only'>{label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side='right'>{label}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </nav>
        </aside>
    );
};

export default SidebarAside;
