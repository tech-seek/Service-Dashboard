'use client';

import { useSearchQuery } from '@/provider/use-search-provider';
import React, { FC } from 'react';
import { DebouncedInput } from '../debouncedInput';
import { Icons } from '../icons';

const GlobalSearch: FC = () => {
    const { searchQuery, setSearchQuery } = useSearchQuery();
    return (
        <div className='relative ml-auto flex-1 md:grow-0'>
            <Icons.Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <DebouncedInput
                type='search'
                placeholder='Search...'
                className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]'
                onChange={(value) => setSearchQuery(String(value))}
                value={searchQuery}
            />
        </div>
    );
};

export default GlobalSearch;
