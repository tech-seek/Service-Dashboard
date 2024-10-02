"use client";
import React, { FC, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from '@/components/ui/datePicker';
import { IServiceUser } from '@/app/types/service';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';

type UsersData = IServiceUser['usersData'][0];

interface IProps {
  onSubmit?: (newUserData: UsersData) => void;
  rowData?: UsersData;
}

const EditUserModalCon: FC<IProps> = ({ onSubmit, rowData }) => {  
  const [name, setName] = useState<string>(rowData?.name ?? "");
  const [phone, setPhone] = useState<string>(rowData?.phone ?? "");
  const [joinDate, setJoinDate] = useState<Date | undefined>(rowData?.joinDate ? new Date(rowData.joinDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(rowData?.endDate ? new Date(rowData.endDate) : undefined);
  const [status, setStatus] = useState<string>(rowData?.status ?? "");
  const [provider, setProvider] = useState<string>(rowData?.provider ?? "");
  const [services, setServices] = useState<string>(rowData?.services ?? "");
  const [account, setAccount] = useState<string>(rowData?.account ?? "");
  const [type, setType] = useState<string>(rowData?.type ?? "");

  const handleSubmit = () => {
    const editedUserData = {
      name,
      phone,
      // joinDate,
      // endDate,
      status,
      provider,
      services,
      account,
      type,
    };
    
    if (onSubmit) {
      onSubmit(editedUserData);
    }
  }


  return (
    <div className=''>
      <div className="grid gap-3 md:gap-6 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="name" className="col-span-1 font-semibold text-base md:text-lg uppercase">
            name
          </Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} id="name" className="col-span-2 bg-[#ffffff62] text-white text-base" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="phone" className="col-span-1 font-semibold text-base md:text-lg uppercase">
            phone
          </Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} id="phone" className="col-span-2 bg-[#ffffff62] text-white text-base" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="col-span-1 font-semibold text-base md:text-lg uppercase">
            join date
          </Label>
          <DatePicker labelClass="hover:bg-[#ffffff62] text-white w-auto font-semibold text-lg capitalize" iconClass="text-white size-5 md:size-6" selectedDate={joinDate} onSelectDate={setJoinDate} />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="col-span-1 font-semibold text-base md:text-lg uppercase">
            end date
          </Label>
          <DatePicker labelClass="hover:bg-[#ffffff62] text-white w-auto font-semibold text-lg capitalize" iconClass="text-white size-5 md:size-6" selectedDate={endDate} onSelectDate={setEndDate} label={""} />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="col-span-1 font-semibold text-base md:text-lg uppercase">
            status
          </Label>
          <Select onValueChange={setStatus}>
            <SelectTrigger className="border-0 font-semibold text-base w-fit capitalize">
              <SelectValue placeholder={status} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className='font-medium text-lg' value="active">Paid</SelectItem>
                <SelectItem className='font-medium text-lg' value="pending">Due</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="col-span-1 font-semibold text-base md:text-lg uppercase">
            provider
          </Label>
          <Select onValueChange={setProvider}>
            <SelectTrigger className="border-0 font-semibold text-base w-fit capitalize">
              <SelectValue placeholder={provider} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className='font-medium text-lg' value="hardik">Hardilk</SelectItem>
                <SelectItem className='font-medium text-lg' value="john">John</SelectItem>
                <SelectItem className='font-medium text-lg' value="walker">Walker</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="col-span-1 font-semibold text-base md:text-lg uppercase">
            services
          </Label>
          <Select onValueChange={setServices}>
            <SelectTrigger className="border-0 font-semibold text-base w-fit capitalize">
              <SelectValue placeholder={services} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className='font-medium text-lg' value="netflix">Netflix</SelectItem>
                <SelectItem className='font-medium text-lg' value="disney">Disney</SelectItem>
                <SelectItem className='font-medium text-lg' value="prime">Prime</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="col-span-1 font-semibold text-base md:text-lg uppercase">
            account
          </Label>
          <Select onValueChange={setAccount}>
            <SelectTrigger className="border-0 font-semibold text-base w-fit capitalize">
              <SelectValue placeholder={account} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className='font-medium text-lg' value="demo1@gmail.com">demo1@gmail.com</SelectItem>
                <SelectItem className='font-medium text-lg' value="demo2@gmail.com">demo2@gmail.com</SelectItem>
                <SelectItem className='font-medium text-lg' value="demo3@gmail.com">demo3@gmail.com</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="col-span-1 font-semibold text-base md:text-lg uppercase">
            type
          </Label>
          <Select onValueChange={setType}>
            <SelectTrigger className="border-0 font-semibold text-base w-fit capitalize">
              <SelectValue placeholder={type} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className='font-medium text-lg' value="share">Share</SelectItem>
                <SelectItem className='font-medium text-lg' value="single">Single</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-6">
        <CustomAlertDialog
          className='bg-white hover:bg-white text-black px-5 h-auto !leading-none font-bold text-base md:text-lg uppercase'
          buttonTitle="submit"
          messageTitle="Are you absolutely sure?"
          message="This action cannot be undone. This will update your data from our servers."
          onClick={handleSubmit}
        />
      </div>
    </div>
  )
}

export default EditUserModalCon