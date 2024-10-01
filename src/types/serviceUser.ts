import { TUserRespone } from './user';


export type TServiceUserPayload = {
    name: string;
    phone: string;
    email?: string;
    joinDate: string;
    endDate: string;
    leftDays?: number;
    status: string;
    type: string;
    model?: string;
    providerName: string;
    serviceId: string;
    serviceAccountId: string;
};

export type TServiceUserResponse = {
    id: string;
    name: string;
    phone: string;
    joinDate: string;
    endDate: string;
    leftDays: number;
    status: string;
    email?: string;
    type: string;
    model?: string;
    providerName: string;
    serviceId: string;
    service: Pick<TServiceUserResponse, 'id' | 'name'>;
    serviceAccount: Pick<TServiceUserResponse, 'id' | 'name' | 'email'>;
    provider: Pick<TUserRespone, 'id' | 'userName' | 'role'>;
    serviceAccountId: string;
    createdAt: Date;
    updatedAt: Date;
};