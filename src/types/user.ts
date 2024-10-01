export type TUserPayload = {
    userName: string;
    password: string;
    role:'admin'|'moderator'
};

export type TUserRespone = {
    id: string;
    userName: string;
    password: string;
    role:'admin'|'moderator'
    createdAt: Date;
    updatedAt: Date;
};

export type TLoginPlayload = {
    userName: string;
    password: string;
};