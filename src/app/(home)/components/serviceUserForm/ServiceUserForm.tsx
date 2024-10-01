'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { TServiceResponse } from '@/types/service';
import { TServiceAccountResponse } from '@/types/serviceAccount';
import { TServiceUserPayload, TServiceUserResponse } from '@/types/serviceUser';
import { DialogClose } from '@/components/ui/dialog';
import SubmitButton from '@/components/ui/submitButton/submitButton';
import { DatePickerSection, InputSection, SelectSection } from '../serviceUserForm';
import { THandleAddServiceUser } from '../serviceUserTable/ServiceUser';

interface IProps {
    servicesAccounts?: TServiceAccountResponse[];
    services?: TServiceResponse[];
    rowData?: TServiceUserResponse;
    onSubmit?: THandleAddServiceUser;
    isSubmitting?: boolean;
}
const initializeFormData = (rowData: TServiceUserResponse | undefined, session: Session | null) => {
    return {
        name: rowData?.name ?? '',
        phone: rowData?.phone ?? '',
        email: rowData?.email ?? '',
        joinDate: rowData?.joinDate ? new Date(rowData?.joinDate ?? '') : '',
        endDate: rowData?.endDate ? new Date(rowData?.endDate ?? '') : '',
        status: rowData?.status ?? '',
        providerName: rowData?.provider.userName ?? session?.user?.name ?? '',
        serviceId: rowData?.service?.name ?? '',
        serviceAccountId: rowData?.serviceAccount.email ?? '',
        type: rowData?.type ?? '',
        model: rowData?.model ?? '',
    };
};

const ServiceUserForm: FC<IProps> = ({
    onSubmit,
    rowData,
    services,
    servicesAccounts,
    isSubmitting,
}) => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState(initializeFormData(rowData, session));
    console.log('🚀 > file: ServiceUserForm.tsx:45 > formData:', formData);

    const serviceAccOptions = useMemo(
        () =>
            servicesAccounts?.map(({ id, email }) => ({
                id,
                name: email,
            })) ?? [],
        [servicesAccounts],
    );

    const serviceOptions = useMemo(
        () =>
            services?.map(({ id, name }) => ({
                id,
                name,
            })) ?? [],
        [services],
    );

    const handleChange = useCallback((key: string, value: string | Date | undefined) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }, []);

    const joinDate = formData?.joinDate ? new Date(formData?.joinDate) : undefined;
    const endDate = formData?.endDate ? new Date(formData?.endDate) : undefined;

    const handleSubmit = () => {
        const serviceId = serviceOptions.find(({ name }) => name === formData.serviceId)?.id ?? '';
        const serviceAccountId =
            serviceAccOptions.find(({ name }) => name === formData.serviceAccountId)?.id ?? '';

        const serviceUserFormData: TServiceUserPayload = {
            ...formData,
            serviceAccountId,
            serviceId,
            joinDate: joinDate?.toISOString() ?? '',
            endDate: endDate?.toISOString() ?? '',
        };
        if (onSubmit) {
            onSubmit(serviceUserFormData);
        }
    };

    return (
        <>
            <div className='grid gap-3 md:gap-6 py-4'>
                <InputSection
                    label='provider'
                    value={formData.providerName ?? ''}
                    onChange={() => {}}
                    tabIndex={-1}
                    readOnly
                />
                <InputSection
                    label='name'
                    placeholder='Enter name'
                    value={formData.name}
                    tabIndex={0}
                    onChange={(value) => handleChange('name', value)}
                />
                <InputSection
                    placeholder='Enter phone number'
                    label='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={(value) => handleChange('phone', value)}
                />
                <InputSection
                    placeholder='Enter email (optional)'
                    label='email'
                    type='email'
                    value={formData.email ?? ''}
                    onChange={(value) => handleChange('email', value)}
                />
                <InputSection
                    placeholder='Enter model (optional)'
                    label='model'
                    value={formData.model}
                    onChange={(value) => handleChange('model', value)}
                />
                <DatePickerSection
                    label='join date'
                    selectedDate={joinDate}
                    onSelectDate={(date) => handleChange('joinDate', date)}
                />
                <DatePickerSection
                    label='end date'
                    selectedDate={endDate}
                    onSelectDate={(date) => handleChange('endDate', date)}
                />
                <SelectSection
                    label='status'
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                    options={[
                        { name: 'Paid', id: 'active' },
                        { name: 'Due', id: 'pending' },
                    ]}
                />
                <SelectSection
                    label='Service'
                    value={formData.serviceId}
                    onValueChange={(value) => handleChange('serviceId', value)}
                    options={serviceOptions}
                />
                <SelectSection
                    label='account'
                    value={formData.serviceAccountId}
                    onValueChange={(value) => handleChange('serviceAccountId', value)}
                    options={serviceAccOptions}
                />
                <SelectSection
                    label='type'
                    value={formData.type}
                    onValueChange={(value) => handleChange('type', value)}
                    options={[
                        { name: 'Share', id: 'share' },
                        { name: 'Single', id: 'single' },
                    ]}
                />
            </div>

            <DialogClose className='w-full'>
                <SubmitButton
                    type='button'
                    className='bg-white hover:bg-white text-black uppercase px-5 font-bold text-base md:text-lg w-full'
                    buttonTitle='submit'
                    onClick={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </DialogClose>
        </>
    );
};

export default memo(ServiceUserForm);
