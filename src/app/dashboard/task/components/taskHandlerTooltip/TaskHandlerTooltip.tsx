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
import { TOOL_TIP_DELAY } from '@/statics';

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
    <TooltipProvider delayDuration={TOOL_TIP_DELAY}>
      <div className="relative inline-block md:hidden" ref={tooltipRef}>
        <Tooltip open={isOpen}>
          <TooltipTrigger asChild>
            <button onClick={handleToggle}>
              <Icons.BadgeMinus />
            </button>
          </TooltipTrigger>
          {isOpen && (
            <TooltipContent className="flex gap-2 p-1.5">
              {activeTab === 'pending' ? (
                <button
                  onClick={() => {
                    handleSolved();
                  }}
                  className='hover:scale-110 px-1.5 py-1'
                >
                  <Icons.SquareCheckBig />
                </button>
              )
                :
                (
                  <button
                    onClick={() => {
                      handleSolved();
                    }}
                    className='hover:scale-110 px-1.5 py-1'
                  >
                    <Icons.Undo2 />
                  </button>
                )
              }
              <button
                onClick={() => {
                  clickEdit();
                  handleClose();
                }}
                className='hover:scale-110 px-1.5 py-1'
              >
                <Icons.Pencil />
              </button>
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
              <Icons.BadgeMinus />
            </span>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2 p-1.5">
            {activeTab === 'pending' ? (
              <button
                onClick={() => {
                  handleSolved();
                }}
                className='hover:scale-110 px-1.5 py-1'
              >
                <Icons.SquareCheckBig />
              </button>
            )
              :
              (
                <button
                  onClick={() => {
                    handleSolved();
                  }}
                  className='hover:scale-110 px-1.5 py-1'
                >
                  <Icons.Undo2 />
                </button>
              )
            }
            <button
              onClick={() => {
                clickEdit();
                handleClose();
              }}
              className='hover:scale-110 px-1.5 py-1'
            >
              <Icons.Pencil />
            </button>
            <button
              onClick={() => {
                // handleDeleteTask();
                setIsConfirmationOpen(true);
              }}
              className='hover:scale-110 px-1.5 py-1'
            >
              <Icons.Trash2 />
            </button>
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
