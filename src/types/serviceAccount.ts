import { TDealerResponse } from './dealer';
import { TServiceUserResponse } from './serviceUser';

export type TServiceAccountPayload = {
    id?: string;
    password: string;
    number: string;
    email: string;
    joinDate: string;
    endDate: string;
    status: string;
    serviceId: string;
    dealerId: string;
};

export type TServiceAccountResponse = {
    id: string;
    password: string;
    number: string;
    email: string;
    joinDate: string;
    endDate: string;
    leftDays: number;
    status: string;
    serviceId: string;
    dealerId: string;
    dealer: Pick<TDealerResponse, 'id' | 'name'>;
    serviceUser: TServiceUserResponse[];
    createdAt: Date;
    updatedAt: Date;
};

export type TMultipleServiceAccTotalRecords = Record<string, number> | number;
