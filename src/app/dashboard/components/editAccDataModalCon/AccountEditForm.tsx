'use client';

import { format } from 'date-fns';
import React, { FC, PropsWithChildren, useMemo, useState } from 'react';
import { TDealerResponse } from '@/types/dealer';
import { TServiceAccountPayload, TServiceAccountResponse } from '@/types/serviceAccount';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';
import { DatePicker } from '@/components/ui/datePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { useDateField, useFormField } from '../../hooks';

interface IProps extends PropsWithChildren {
    rowData?: TServiceAccountResponse;
    onDelete: (id: string) => void;
    onEdit: (editedUserData: TServiceAccountPayload) => void;
    dealers: TDealerResponse[];
}
const renderField = (label: string, fieldId: string, fieldComponent: React.ReactNode) => (
    <div className='grid grid-cols-3 items-center gap-4'>
        <Label
            htmlFor={fieldId}
            className='col-span-1 font-semibold text-base md:text-lg uppercase'
        >
            {label}
        </Label>
        {fieldComponent}
    </div>
);

const FormFields: FC<IProps> = ({ rowData, onDelete, onEdit, dealers, children }) => {
    const nameField = useFormField(rowData?.email ?? '');
    const numberField = useFormField(rowData?.number ?? '');
    const passwordField = useFormField(rowData?.password ?? '');
    const joinDateField = useDateField(rowData?.joinDate ?? '');
    const endDateField = useDateField(rowData?.endDate ?? '');
    const [status, setStatus] = useState<string>(rowData?.status ?? '');
    const [selectedDealer, setSelectedDealer] = useState<string>(rowData?.dealer?.name ?? '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // take uniqueDealers
    const uniqueDealers = useMemo(
        () => Array.from(new Set(dealers.map(({ id, name }) => ({ id, name })))),
        [dealers],
    );
    const updatedAt = rowData?.updatedAt
        ? format(new Date(rowData.updatedAt), 'dd MMM yyyy hh:mm:ss')
        : '-- -- -- -- --';
    // handle the edit accounts
    const handleEdit = () => {
        const dealerId = dealers.find(({ name }) => name === selectedDealer)?.id ?? '';
        const editedUserData: TServiceAccountPayload = {
            id: rowData?.id ?? '',
            number: rowData?.number ?? '',
            email: nameField.value,
            password: passwordField.value,
            status,
            dealerId,
            endDate: endDateField.selectedDate?.toISOString() ?? '',
            joinDate: joinDateField.selectedDate?.toISOString() ?? '',
            serviceId: rowData?.serviceId ?? '',
        };
        onEdit(editedUserData);
    };
    // handle the delete accounts
    const handleDelete = () => onDelete(rowData?.id ?? '');

    return (
        <>
            <div className='grid gap-3 md:gap-6 py-4'>
                {renderField(
                    'Account',
                    'account',
                    <Input
                        id='account'
                        {...nameField}
                        className='col-span-2 bg-[#ffffff62] text-white text-base'
                    />,
                )}
                {renderField(
                    'Password',
                    'password',
                    <Input
                        id='password'
                        {...passwordField}
                        className='col-span-2 bg-[#ffffff62] text-white text-base'
                    />,
                )}
                {renderField(
                    'Join Date',
                    'joinDate',
                    <DatePicker
                        labelClass='w-auto font-semibold text-lg capitalize'
                        iconClass='text-white size-5 md:size-6'
                        label='Join Date'
                        selectedDate={joinDateField.selectedDate}
                        onSelectDate={joinDateField.setSelectedDate}
                    />,
                )}
                {renderField(
                    'End Date',
                    'endDate',
                    <DatePicker
                        labelClass='w-auto font-semibold text-lg capitalize'
                        iconClass='text-white size-5 md:size-6'
                        label='End Date'
                        selectedDate={endDateField.selectedDate}
                        onSelectDate={endDateField.setSelectedDate}
                    />,
                )}
                {renderField(
                    'Status',
                    'status',
                    <Select onValueChange={setStatus}>
                        <SelectTrigger className='border-0 px-2.5 font-semibold text-base w-fit capitalize hover:bg-[#ffffff62]'>
                            <SelectValue placeholder={status} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {['active', 'disabled'].map((value) => (
                                    <SelectItem
                                        key={value}
                                        className='font-medium text-lg capitalize'
                                        value={value}
                                    >
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>,
                )}
                {renderField(
                    'Dealer',
                    'dealer',
                    <SelelectAndSearch
                        placeholder='Select Dealer'
                        className='border-0 font-semibold text-base w-fit capitalize px-3 hover:bg-[#ffffff62]'
                        iconStyle='ml-0 h-[18px] w-[18px] !opacity-100'
                        options={uniqueDealers ?? []}
                        value={selectedDealer}
                        onChange={setSelectedDealer}
                    />,
                )}
            </div>
            {children}
            <div className='mt-4 md:mt-5 flex max-lg:flex-col justify-center gap-5 relative'>
                <span className='lg:hidden'>last updated: {updatedAt}</span>
                <span className=' max-lg:hidden absolute top-1/2 -translate-y-1/2 left-0'>
                    last updated: {updatedAt}
                </span>
                <CustomAlertDialog
                    className='bg-white hover:bg-white text-black'
                    buttonTitle='Update'
                    messageTitle='Are you absolutely sure?'
                    message='This action cannot be undone. This will update your data from our servers.'
                    onClick={() => {
                        handleEdit();
                        setIsSubmitting(true);
                    }}
                    isSubmitting={isSubmitting}
                />
                <CustomAlertDialog
                    buttonTitle='Delete'
                    messageTitle='Are you absolutely sure?'
                    message='This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
                    onClick={handleDelete}
                />
            </div>
        </>
    );
};

export default FormFields;
