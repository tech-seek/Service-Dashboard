import { updateLeftDays } from './controller';

export const GET = async () => {
    const res = await updateLeftDays();
    return res
};
