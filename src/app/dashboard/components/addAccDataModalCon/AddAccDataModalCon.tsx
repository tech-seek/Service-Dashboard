import React, { FC, useCallback, useState } from 'react';
import { TDealerResponse } from '@/types/dealer';
import { TServiceAccountPayload, TServiceAccountResponse } from '@/types/serviceAccount';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datePicker';
import { Icons } from '@/components/ui/icons';
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

interface IProps {
    rowData?: TServiceAccountResponse;
    onSubmit: (newUserData: TServiceAccountPayload) => void;
    serviceId: string;
    dealers: TDealerResponse[];
}

const AddAccDataModalCon: FC<IProps> = ({ rowData, onSubmit, serviceId, dealers }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        serviceId,
        email: rowData?.email ?? '',
        number: rowData?.number ?? '',
        password: rowData?.password ?? '',
        joinDate: rowData?.joinDate ? new Date(rowData.joinDate) : undefined,
        endDate: rowData?.endDate ? new Date(rowData.endDate) : undefined,
        status: rowData?.status ?? '',
        dealerId: rowData?.dealerId ?? '',
    });
    const handleInputChange = useCallback((field: string, value: string | Date | undefined) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        const selectedDealerId =
            dealers.find((dealer) => dealer.name === formData.dealerId)?.id ?? '';
        const newUserData: TServiceAccountPayload = {
            ...formData,
            dealerId: selectedDealerId,
            joinDate: formData.joinDate?.toISOString() ?? '',
            endDate: formData.endDate?.toISOString() ?? '',
        };
        onSubmit(newUserData);
    }, [dealers, formData, onSubmit]);

    return (
        <div className=''>
            <div className='grid gap-3 md:gap-6 py-4'>
                <div className='grid grid-cols-3 items-center gap-4'>
                    <Label
                        htmlFor='account'
                        className='col-span-1 font-semibold text-base md:text-lg uppercase'
                    >
                        account
                    </Label>
                    <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        id='account'
                        className='col-span-2 bg-[#ffffff62] text-white text-base'
                    />
                </div>
                <div className='grid grid-cols-3 items-center gap-4'>
                    <Label
                        htmlFor='account'
                        className='col-span-1 font-semibold text-base md:text-lg uppercase'
                    >
                        Phone
                    </Label>
                    <Input
                        value={formData.number}
                        onChange={(e) => handleInputChange('number', e.target.value)}
                        id='number'
                        className='col-span-2 bg-[#ffffff62] text-white text-base'
                    />
                </div>

                <div className='grid grid-cols-3 items-center gap-4'>
                    <Label
                        htmlFor='password'
                        className='col-span-1 font-semibold text-base md:text-lg uppercase'
                    >
                        password
                    </Label>
                    <Input
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        id='password'
                        className='col-span-2 bg-[#ffffff62] text-white text-base'
                    />
                </div>

                <div className='grid grid-cols-3 items-center gap-4'>
                    <Label className='col-span-1 font-semibold text-base md:text-lg uppercase'>
                        join date
                    </Label>
                    <DatePicker
                        labelClass='hover:text-gray-900 text-white w-auto font-semibold text-lg capitalize'
                        iconClass='text-white size-5 md:size-6'
                        selectedDate={formData.joinDate}
                        onSelectDate={(date) => handleInputChange('joinDate', date)}
                    />
                </div>

                <div className='grid grid-cols-3 items-center gap-4'>
                    <Label className='col-span-1 font-semibold text-base md:text-lg uppercase'>
                        end date
                    </Label>
                    <DatePicker
                        labelClass='hover:text-gray-900 text-white w-auto font-semibold text-lg capitalize'
                        iconClass='text-white size-5 md:size-6'
                        selectedDate={formData.endDate}
                        onSelectDate={(date) => handleInputChange('endDate', date)}
                        label={''}
                    />
                </div>

                <div className='grid grid-cols-3 items-center gap-4'>
                    <Label className='col-span-1 font-semibold text-base md:text-lg uppercase'>
                        status
                    </Label>
                    <Select onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className='border-0 px-2.5 font-semibold text-base w-fit capitalize hover:bg-[#ffffff62]'>
                            <SelectValue placeholder={formData.status} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem className='font-medium text-lg' value='active'>
                                    Active
                                </SelectItem>
                                <SelectItem className='font-medium text-lg' value='disabled'>
                                    Disabled
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className='grid grid-cols-3 items-center gap-4'>
                    <Label className='col-span-1 font-semibold text-base md:text-lg uppercase'>
                        dealer
                    </Label>
                    <SelelectAndSearch
                        className='border-0 font-semibold text-base w-fit capitalize px-3 hover:bg-[#ffffff62]'
                        iconStyle='ml-0 h-[18px] w-[18px] !opacity-100'
                        placeholder=''
                        options={dealers}
                        value={formData.dealerId ?? ''}
                        onChange={(value) => handleInputChange('dealerId', value)}
                    />
                </div>
            </div>
            <div className='mt-5 flex justify-center gap-6'>
                <Button
                    onClick={() => {
                        handleSubmit();
                        setIsSubmitting(true);
                    }}
                    type='button'
                    className='bg-green-600 hover:bg-green-700 px-5 inline-flex items-center gap-2 h-auto !leading-none font-bold text-white text-base md:text-lg uppercase'
                >
                    {isSubmitting ? (
                        <span className='inline-flex items-center gap-2'>
                            Submitting... <Icons.Loader className='animate-spin' />
                        </span>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default AddAccDataModalCon;
