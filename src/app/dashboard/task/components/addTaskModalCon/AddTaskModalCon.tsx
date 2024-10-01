'use client';

import { fetchAllServicesAcc, fetchServicesData, fetchTaskData } from '@/http';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { TTaskPayload, TTaskResponse } from '@/types/task';
import { useFetchData } from '@/lib/useFetchData';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { Textarea } from '@/components/ui/textarea';
import { createTasksAction, deleteTaskAction, updateTaskAction } from '@/app/actions/tasks';
import useShowToast from '@/app/hooks/useShowToast';
import { TaskHandlerTooltip } from '../taskHandlerTooltip';
import { TableRowSkeleton } from '@/components/ui/table-skeleton';

const AddTaskModalCon = () => {
    const { data: services, isLoading: isServicesLoading } = useFetchData(
        ['services'],
        fetchServicesData,
    );
    const { data: tasks, isLoading: isTasksLoading } = useFetchData(['tasks'], fetchTaskData);

    const { data: serviceAccounts, isLoading: isServiceAccLoading } = useFetchData(
        ['serviceAccounts'],
        fetchAllServicesAcc,
    );
    const [phNumber, setPhNumber] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [selectedService, setSelectedService] = useState<string | null>('');
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedServiceAcc, setSelectedServiceAcc] = useState<string | null>('');
    const [selectedServiceAccId, setSelectedServiceAccId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'solved'>('pending');
    const [tasksData, setTasksData] = useState<TTaskResponse[]>(tasks?.data || []);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { showToast } = useShowToast();
    const queryClient = useQueryClient();
    const currentTasks = tasksData?.filter((task) => task.status === activeTab);

    const clickEdit = (taskId: string) => {
        // Implement the logic to edit the task
        const findTask = tasksData.find((task) => task.id === taskId);
        setPhNumber(findTask?.number ?? '');
        setTaskDescription(findTask?.description ?? '');
        setSelectedServiceAcc(findTask?.serviceAccount.email ?? '');
        setSelectedService(findTask?.service.name ?? '');
        setSelectedServiceId(findTask?.service.id ?? null);
        setSelectedServiceAccId(findTask?.serviceAccount.id ?? null);
        setIsEditing(true); // Set editing mode
        setCurrentTaskId(taskId); // Save the current task ID
    };
    const handleEditTask = async () => {
        setIsSubmitting(true);
        if (
            !phNumber ||
            !taskDescription ||
            !selectedServiceId ||
            !selectedServiceAccId ||
            !currentTaskId
        ) {
            return showToast(false, 'Please fill out all fields');
        }

        const editedTaskData: TTaskPayload = {
            number: phNumber,
            serviceId: selectedServiceId,
            serviceAccountId: selectedServiceAccId,
            description: taskDescription,
            status: activeTab === 'pending' ? 'pending' : 'solved',
        };

        const { data, error } = await updateTaskAction(currentTaskId, editedTaskData);
        if (error) {
            return showToast(false, error || 'Failed to edit task');
        }

        const message = (data as { message: string }).message;
        showToast(true, message);
        setTasksData((prevTasks) =>
            prevTasks.map((task) =>
                task.id === currentTaskId ? { ...task, ...editedTaskData } : task,
            ),
        );

        // Reset form fields
        setPhNumber('');
        setTaskDescription('');
        setSelectedServiceAcc(null);
        setSelectedService(null);
        setIsEditing(false);
        setCurrentTaskId(null);

        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        setIsSubmitting(false);
    };

    const handleDeleteTask = async (taskId: string) => {
        const { data, error } = await deleteTaskAction(taskId);
        if (error) return showToast(false, error);
        const message = (data as { message: string }).message;
        showToast(true, message);
        setTasksData((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    const submitTask = async () => {
        setIsSubmitting(true);
        if (!phNumber || !taskDescription || !selectedService || !selectedServiceAcc) {
            return showToast(false, 'Please fill out all fields');
        }

        // Prepare the payload according to TTaskPayload
        const taskPayload: TTaskPayload = {
            number: phNumber,
            serviceId: selectedServiceId!, // assuming the serviceId is mapped to selectedService
            serviceAccountId: selectedServiceAccId!, // assuming the serviceAccountId is mapped to selectedRequest
            description: taskDescription,
            status: 'pending', // Newly created tasks default to 'pending'
        };

        const { data, error } = await createTasksAction(taskPayload);
        if (error) {
            return showToast(false, error || 'Failed to create task');
        }

        showToast(true, 'Task created successfully!');
        setTasksData((prevTasks) => [...prevTasks, data]);

        setPhNumber('');
        setTaskDescription('');
        setSelectedServiceAcc(null);
        setSelectedService(null);

        queryClient.invalidateQueries({ queryKey: ['tasks'] });

        setIsSubmitting(false);
    };

    const handleSolved = async (taskId: string) => {
        const taskToToggle = tasksData.find((task) => task.id === taskId);

    if (!taskToToggle) {
        console.log('Task not found');
        return;
    }

        // Ensure the required fields are not undefined
        const number = taskToToggle.number ?? '';
    const serviceId = taskToToggle.service?.id ?? '';
    const serviceAccountId = taskToToggle.serviceAccount?.id ?? '';
    const description = taskToToggle.description ?? '';

        const newStatus = taskToToggle.status === 'solved' ? 'pending' : 'solved';

        // Ensure TTaskPayload is fully populated with valid types
        const updatedTask: TTaskPayload = {
            number,
            serviceId,
            serviceAccountId,
            description,
            status: newStatus,
        };

        // Call the update action to reflect the changes in the backend
        const { data, error } = await updateTaskAction(taskId, updatedTask);
        const message = (data as { message: string }).message;
        showToast(true, message);
        if (error) {
            return showToast(false, 'Failed to update task status');
        }
        setTasksData((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
        );

        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    useEffect(() => {
        if (tasks?.data) {
            setTasksData(tasks.data);
        }
    }, [tasks]);

    const requestOptions = useMemo(
        () => serviceAccounts?.data.map(({ id, email }) => ({ id, email })),
        [serviceAccounts?.data],
    );
    return (
        <>
            <div className='flex flex-col md:flex-row justify-between md:items-center w-full gap-y-3'>
                <div className='grid md:flex flex-col grid-cols-4 items-center md:items-start gap-3'>
                    <Label
                        htmlFor='phNumber'
                        className='col-span-1 font-semibold uppercase text-base'
                    >
                        number
                    </Label>
                    <Input
                        value={phNumber}
                        type='number'
                        onChange={(e) => setPhNumber(e.target.value)}
                        id='phNumber'
                        className='col-span-3 dark:bg-slate-900 text-lg'
                    />
                </div>
                <div className='grid md:flex flex-col grid-cols-4 items-center md:items-start gap-3'>
                    <Label
                        htmlFor='phNumber'
                        className='col-span-1 font-semibold uppercase text-base'
                    >
                        service
                    </Label>
                    <SelelectAndSearch
                        placeholder='select'
                        options={services?.data ?? []}
                        value={selectedService ?? ''}
                        onChange={(value) => {
                            const findSlectedService = services?.data.find(
                                (service) => service.name === value,
                            );
                            setSelectedServiceId(findSlectedService?.id || null);
                            setSelectedService(findSlectedService?.name || null);
                        }}
                        variant={'default'}
                        className='col-span-3 capitalize font-semibold px-5 py-1 text-gray-50 rounded'
                        dropSelect={true}
                        isLoading={isServicesLoading}
                    />
                </div>
                <div className='grid md:flex flex-col grid-cols-4 items-center md:items-start gap-3'>
                    <Label
                        htmlFor='phNumber'
                        className='col-span-1 font-semibold uppercase text-base'
                    >
                        request
                    </Label>
                    <SelelectAndSearch
                        placeholder='select'
                        options={requestOptions ?? []}
                        value={selectedServiceAcc ?? ''}
                        onChange={(value) => {
                            const findSlectedAccount = requestOptions?.find(
                                (acc) => acc.email === value,
                            );
                            setSelectedServiceAccId(findSlectedAccount?.id || null);
                            setSelectedServiceAcc(findSlectedAccount?.email || null);
                        }}
                        variant={'default'}
                        className='col-span-3 capitalize font-semibold px-5 py-1 border text-gray-50 rounded'
                        dropSelect={true}
                        isLoading={isServiceAccLoading}
                    />
                </div>
            </div>

            <Textarea
                className='text-base mt-5 resize-none bg-zinc-50 dark:bg-slate-900 h-44 md:h-60'
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
            />
            <div className='flex justify-end'>
                {isEditing ? (
                    <CustomAlertDialog
                        className='bg-transparent hover:bg-transparent text-gray-700 p-0 h-fit shadow-none'
                        buttonTitle={
                            <span>
                                <Button
                                    type='button'
                                    className='font-semibold text-base border uppercase my-5 dark:text-gray-200'
                                >
                                    {isSubmitting ? (
                                        <span className='inline-flex items-center gap-2'>
                                            Submitting... <Icons.Loader className='animate-spin' />
                                        </span>
                                    ) : (
                                        'submit Edit'
                                    )}
                                </Button>
                            </span>
                        }
                        messageTitle='Are you absolutely sure?'
                        message='This action will Edit your Task.'
                        onClick={handleEditTask}
                    />
                ) : (
                    <CustomAlertDialog
                        className='bg-transparent hover:bg-transparent text-gray-700 p-0 h-fit shadow-none'
                        buttonTitle={
                            <span>
                                <Button
                                    type='button'
                                    className='font-semibold text-base border uppercase my-5 dark:text-gray-200'
                                >
                                    {isSubmitting ? (
                                        <span className='inline-flex items-center gap-2'>
                                            Submitting... <Icons.Loader className='animate-spin' />
                                        </span>
                                    ) : (
                                        'submit'
                                    )}
                                </Button>
                            </span>
                        }
                        messageTitle='Are you absolutely sure?'
                        message='This action will create your Task.'
                        onClick={submitTask}
                    />
                )}
            </div>
            <div>
                <div className='mt-3 md:mt-5 flex gap-4'>
                    <Button
                        type='button'
                        className={`font-semibold text-base border uppercase ${activeTab === 'pending' ? 'dark:text-gray-200' : 'bg-secondary dark:bg-secondary-foreground text-gray-700 hover:bg-secondary hover:text-gray-700'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        PENDING
                    </Button>
                    <Button
                        type='button'
                        className={`font-semibold text-base border uppercase ${activeTab === 'solved' ? 'dark:text-gray-200' : 'bg-secondary dark:bg-secondary-foreground text-gray-700 hover:bg-secondary hover:text-gray-700'}`}
                        onClick={() => setActiveTab('solved')}
                    >
                        SOLVED
                    </Button>
                </div>

                <div className='h-48 md:h-56 mt-3 md:mt-4 overflow-y-auto'>
                    {!isTasksLoading ? (
                        currentTasks?.map(
                            (
                                { id, service, serviceAccount, number, description, createdAt },
                                index,
                            ) => (
                                <Accordion
                                    key={id}
                                    type='multiple'
                                    className='min-w-[650px] max-w-full'
                                >
                                    <AccordionItem value={id} className='mb-1'>
                                        <AccordionTrigger
                                            className={cn(
                                                'flex items-center rounded-[5px] bg-cream mb-0.5',
                                                activeTab === 'solved'
                                                    ? 'bg-green-400'
                                                    : 'bg-cream',
                                            )}
                                        >
                                            <div className='w-full text-start font-semibold capitalize text-gray-800 flex '>
                                                <span className='min-w-[5%] flex-initial text-center px-2 pt-2 pb-1.5'>
                                                    {index + 1}
                                                </span>
                                                <span className='min-w-[13%] flex-1 px-2 pt-2 pb-1.5'>
                                                    {service.name}
                                                </span>
                                                <span className='min-w-[38%] flex-1 px-2 pt-2 pb-1.5 '>
                                                    {serviceAccount.email}
                                                </span>
                                                <span className='min-w-[16%] flex-1 px-2 pt-2 pb-1.5'>
                                                    {number}
                                                </span>
                                                <span className='min-w-[21%] flex-1 px-2 pt-2 pb-1.5 whitespace-nowrap'>
                                                    {format(
                                                        new Date(createdAt ?? ''),
                                                        'dd MMM yyyy HH:mm',
                                                    )}
                                                </span>
                                                <span className='min-w-[7%] flex-initial grid place-items-center px-2 pt-2 pb-1.5'>
                                                    <TaskHandlerTooltip
                                                        clickEdit={() => clickEdit(id)}
                                                        handleSolved={() => handleSolved(id)}
                                                        handleDeleteTask={() =>
                                                            handleDeleteTask(id)
                                                        }
                                                        activeTab={activeTab}
                                                    />
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent
                                            className={cn(
                                                'px-2.5 py-2 dark:text-gray-700',
                                                activeTab === 'solved'
                                                    ? 'bg-green-400'
                                                    : 'bg-cream',
                                            )}
                                        >
                                            {description}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ),
                        )
                    ) : (
                        Array.from({ length: 3 }, (_, i) => (
                            <TableRowSkeleton key={i} TrClasses='mb-1.5' />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AddTaskModalCon;
