export interface IServiceUser {
    id: string;
    serviceName: string;
    usersData: {
        id?: string;
        sl?: number;
        name?: string;
        password?: string;
        phone?: string;
        joinDate?: string;
        endDate?: string;
        leftDays?: number;
        status?: string;
        userCount?: number;
        provider?: string;
        services?: string;
        account?: string;
        type?: string;
        subUsers?: IServiceSubUser[];
    }[];
}
[];

export interface IServiceSubUser {
    id?: string;
    sl?: number;
    name?: string;
    type?: string;
    phoneNumber?: string;
    joinDate?: string;
    expiresIn?: number;
}
[];
