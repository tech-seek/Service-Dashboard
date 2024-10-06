import { TDealerResponse } from '@/types/dealer';
import { TTaskResponse } from '@/types/task';
import { TUserRespone } from '@/types/user';
import { tryCatch } from '@/lib/trycatch';

export type TDealersData = {
    data: TDealerResponse[];
};

export type TTaskData = {
    data: TTaskResponse[];
};

export type TUsersData = {
    data: TUserRespone[];
};

// const { data: dealers } = useFetchData(['dealers'], fetchDealerData);
export const fetchDealerData = async () => {
    const [data, error] = await tryCatch<TDealersData>('dealers');
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};

export const fetchTaskData = async () => {
    const [data, error] = await tryCatch<TTaskData>('tasks');
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};

// get user
// const { data: user } = useFetchData(['users'], getUser);
export const getUsers = async () => {
    const [data, error] = await tryCatch<TUsersData>('users');
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};
export const getPendingTaskCount = async () => {
    const [data, error] = await tryCatch('tasks?pending-task-count=true');
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};

export * from './service';
export * from './serviceAccounts';
export * from './serviceUsers';
