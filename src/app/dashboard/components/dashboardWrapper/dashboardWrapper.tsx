'use client';

import { useSearchQuery } from '@/provider/use-search-provider';
import { ONGOING } from '@/statics';
import { ISearchParams } from '@/types';
import { useMemo } from 'react';
import TableSkeleton from '@/components/ui/table-skeleton';
import { IServiceUser } from '@/app/types/service';
import { useServiceTableDependencies } from '../../hooks';
import RenderTable from './RenderTable';

export type UsersData = IServiceUser['usersData'] & { joinDate?: string; endDate?: string };

const DashboardWrapper = ({ searchParams }: ISearchParams) => {
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
        `q=${ONGOING}&page=${page}&limit=${limit}&search=${searchQuery}`,
        page,
        limit,
        searchQuery,
    );
    const renderServices = useMemo(() => {
        if (!services || services.length === 0) {
            return (
                <div className='grid place-items-center h-dvh mt-4 md:mt-8 gap-10'>
                    {Array.from({ length: 3 }, (_, i) => (
                        <TableSkeleton key={i} />
                    ))}
                </div>
            );
        }

        return services.map((item) => {
            return (
                <RenderTable
                    key={item.id}
                    item={item}
                    filterServiceAccounts={filterServiceAccounts}
                    selectedDealer={selectedDealer}
                    selectedDates={selectedDates}
                    isLoading={isLoading}
                    isPending={isPending}
                    handleDealerChange={handleDealerChange}
                    handleDateChange={handleDateChange}
                    dealers={dealers}
                    totalPage={totalPage ?? {}}
                    queryPath={ONGOING}
                />
            );
        });
    }, [
        services,
        filterServiceAccounts,
        selectedDealer,
        selectedDates,
        isLoading,
        isPending,
        handleDealerChange,
        handleDateChange,
        dealers,
        totalPage,
    ]);

    return (
        <section className='mb-10'>
            <div className='container'>{renderServices}</div>
        </section>
    );
};

export default DashboardWrapper;
