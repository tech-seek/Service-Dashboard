import { ISerchParams } from '@/types';
import React from 'react';
import { ServiceUser } from './serviceUserTable';

const HomeWrapper = ({ searchParams }: ISerchParams) => {
    return (
        <section>
            <ServiceUser
                searchParams={searchParams}
                serviceName='Expiring'
                isExpiring={true}
                BGColor='bg-red-300 dark:bg-red-400'
                headerClasses='bg-red-600 hover:bg-red-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white'
            />
            <ServiceUser
                searchParams={searchParams}
                serviceName='ongoing'
                isExpiring={false}
                isHideButtonContainer
            />
        </section>
    );
};

export default HomeWrapper;
