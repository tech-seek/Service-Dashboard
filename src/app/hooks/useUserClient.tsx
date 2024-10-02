'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { TUserRespone } from '@/types/user';
import { getUserByNameAction } from '../actions/user';

export const useUserClient = () => {
    const [user, setUser] = useState<TUserRespone | null>(null);
    const session = useSession();
    useEffect(() => {
        const admin = async () => {
            const result = await getUserByNameAction(session?.data?.user?.name ?? '');
            setUser(result as TUserRespone | null);
        };
        void admin();
    }, [session?.data?.user?.name]);
    const memorizeUser = useMemo(() => user, [user]);
    return memorizeUser;
};

export const useIsAdmin = () => {
    const user = useUserClient();
    const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);
    return isAdmin;
};
