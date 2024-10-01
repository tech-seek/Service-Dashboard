import { TOOL_TIP_DELAY } from '@/statics';
import React, { FC, useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeleteService, EditService } from '.';

interface IProps {
    name: string;
    serviceId: string;
}
const ServiceName: FC<IProps> = ({ name, serviceId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenTooltip, setIsOpenTooltip] = useState(false);
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpenTooltip((prev) => !prev);
    };
    return (
        <>
            <TooltipProvider delayDuration={TOOL_TIP_DELAY}>
                <div className="relative block md:hidden">
                    <Tooltip open={isOpenTooltip}>
                        <TooltipTrigger asChild>
                            <div onClick={handleToggle} className='w-fit px-4 mx-auto cursor-pointer'>
                                <h3 className='font-bold inline-block select-none dark:text-white text-3xl md:text-2xl uppercase mb-4 '>
                                    {name}
                                </h3>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className='flex items-center gap-3'>
                            <Icons.Pencil
                                className='hover:scale-110 cursor-pointer dark:text-gray-100'
                                onClick={() => setIsOpenEdit(true)}
                            />
                            <Icons.Trash2
                                className='hover:scale-110 cursor-pointer dark:text-gray-100'
                                onClick={() => setIsOpen(true)}
                            />
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="relative hidden md:block">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='w-fit px-4 mx-auto cursor-pointer'>
                                <h3 className='font-bold inline-block select-none dark:text-white text-3xl md:text-2xl uppercase mb-4 '>
                                    {name}
                                </h3>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className='flex items-center gap-3'>
                            <Icons.Pencil
                                className='hover:scale-110 cursor-pointer dark:text-gray-100'
                                onClick={() => setIsOpenEdit(true)}
                            />
                            <Icons.Trash2
                                className='hover:scale-110 cursor-pointer dark:text-gray-100'
                                onClick={() => setIsOpen(true)}
                            />
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
            <EditService name={name} id={serviceId} isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} />
            <DeleteService id={serviceId} isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default ServiceName;
