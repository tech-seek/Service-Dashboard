'use client';

import { useSearchQuery } from '@/provider/use-search-provider';
import { EXPIRING } from '@/statics';
import React from 'react';
import TableSkeleton from '@/components/ui/table-skeleton';
import RenderTable from '@/app/dashboard/components/dashboardWrapper/RenderTable';
import { useServiceTableDependencies } from '@/app/dashboard/hooks';
import { ISerchParams } from '@/types';

const ServiceAccountsExpireTable = ({ searchParams }: ISerchParams) => {
    const page = parseInt(searchParams['page'] ?? '1', 10);
    const limit = parseInt(searchParams['limit'] ?? '10', 10);
    const { searchQuery } = useSearchQuery();

    const {
        services,
        isPending,
        isLoading,
        filterServiceAccounts,
        handleDateChange,
        handleDealerChange,
        selectedDates,
        selectedDealer,
        dealers,
        totalPage,
    } = useServiceTableDependencies(
        `q=${EXPIRING}&page=${page}&limit=${limit}&search=${searchQuery}`,
        page,
        limit,
        searchQuery,
    );

    if (!services || services.length === 0) {
        return (
            <div className='grid place-items-center mt-4 md:mt-8 gap-10'>
                <TableSkeleton TbodyClasses='h-[58dvh]' />
            </div>
        );
    }

    return (
        <section className='mb-10'>
            <div className='container'>
                <RenderTable
                    item={services}
                    filterServiceAccounts={filterServiceAccounts}
                    selectedDealer={selectedDealer}
                    selectedDates={selectedDates}
                    isLoading={isLoading}
                    isPending={isPending}
                    handleDealerChange={handleDealerChange}
                    handleDateChange={handleDateChange}
                    dealers={dealers}
                    queryPath={EXPIRING}
                    totalPage={totalPage ?? {}}
                />
            </div>
        </section>
    );
};

export default ServiceAccountsExpireTable;
