'use client';

import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';


interface ISearchQueryContext {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}
const SearchQueryContext = createContext<ISearchQueryContext | undefined>(undefined);

export const useSearchQuery = () => {
    const context = useContext(SearchQueryContext);
    if (!context) {
        throw new Error('useSearchQuery must be used within a SearchQueryProvider');
    }
    return context;
};
const SearchQueryProvider = ({ children }: { children: ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const value = useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery, setSearchQuery]);
    return <SearchQueryContext.Provider value={value}>{children}</SearchQueryContext.Provider>;
};

export default SearchQueryProvider;