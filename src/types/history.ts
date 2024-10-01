export type THistoryPayload = {
    name: string;
    phone: string;
    serviceId: string;
    providerId: string;
    lastExpire: string;
};

export type THistoryResponse = {
    id: string;
    name: string;
    phone: string;
    serviceId: string;
    services: {
        id: string;
        name: string;
    };
    providers: {
        id: string;
        userName: string;
    };
    lastExpire: string;
    createdAt: Date;
    updatedAt: Date;
};
