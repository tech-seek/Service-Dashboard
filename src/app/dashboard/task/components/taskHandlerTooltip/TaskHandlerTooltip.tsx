"use client";
import React, { FC, useEffect, useRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from '@/components/ui/icons';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';

interface IProps {
  clickEdit: () => void;
  handleSolved: () => void;
  handleDeleteTask: () => void;
  activeTab: 'pending' | 'solved';
}

const TaskHandlerTooltip: FC<IProps> = ({ clickEdit, handleSolved, handleDeleteTask, activeTab }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipRef]);

  return (
    <TooltipProvider>
      <div className="relative inline-block md:hidden" ref={tooltipRef}>
        <Tooltip open={isOpen}>
          <TooltipTrigger asChild>
            <span onClick={handleToggle}>
              <Icons.badgeMinus />
            </span>
          </TooltipTrigger>
          {isOpen && (
            <TooltipContent className="flex gap-2 p-1.5">
              {activeTab === 'pending' ? (
                <span
                  onClick={() => {
                    handleSolved();
                  }}
                  className='hover:scale-110 px-1.5 py-1'
                >
                  <Icons.SquareCheckBig />
                </span>
              )
                :
                (
                  <span
                    onClick={() => {
                      handleSolved();
                    }}
                    className='hover:scale-110 px-1.5 py-1'
                  >
                    <Icons.Undo2 />
                  </span>
                )
              }
              <span
                onClick={() => {
                  clickEdit();
                  handleClose();
                }}
                className='hover:scale-110 px-1.5 py-1'
              >
                <Icons.Pencil />
              </span>
              <CustomAlertDialog
                buttonTitle={<Icons.Trash2 />}
                className='hover:scale-110 px-1.5 py-1 bg-transparent shadow-none hover:bg-transparent hover:shadow-none'
                message='Are you sure you want to delete this Task?'
                messageTitle='Delete Task'
                onClick={() => { handleDeleteTask(), handleClose() }}
              />
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Icons.badgeMinus />
            </span>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2 p-1.5">
            {activeTab === 'pending' ? (
              <span
                onClick={() => {
                  handleSolved();
                }}
                className='hover:scale-110 px-1.5 py-1'
              >
                <Icons.SquareCheckBig />
              </span>
            )
              :
              (
                <span
                  onClick={() => {
                    handleSolved();
                  }}
                  className='hover:scale-110 px-1.5 py-1'
                >
                  <Icons.Undo2 />
                </span>
              )
            }
            <span
              onClick={() => {
                clickEdit();
                handleClose();
              }}
              className='hover:scale-110 px-1.5 py-1'
            >
              <Icons.Pencil />
            </span>
            <span
              onClick={() => {
                // handleDeleteTask();
                setIsConfirmationOpen(true);
              }}
              className='hover:scale-110 px-1.5 py-1'
            >
              <Icons.Trash2 />
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
      <CustomAlertDialog
            buttonTitle=''
            message='Are you sure you want to delete this task?'
            messageTitle='Delete Task'
            className='bg-transparent p-0'
            isOpen={isConfirmationOpen}
            setIsOpen={setIsConfirmationOpen}
            onClick={handleDeleteTask}
        />
    </TooltipProvider>
    
  );
};

export default TaskHandlerTooltip;
