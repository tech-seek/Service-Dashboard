export type TTaskPayload = {
    number: string;
    serviceId: string;
    serviceAccountId: string;
    description: string;
    status: 'pending' | 'solved';
};

export type TTaskResponse = {
    id: string;
    number: string;
    service: {
        id: string;
        name: string;
    },
    serviceAccount: {
        id: string;
        email: string;
    },
    serviceId: string;
    serviceAccountId: string;
    description: string;
    status: 'pending' | 'solved';
    createdAt: Date;
    updatedAt: Date;
};
