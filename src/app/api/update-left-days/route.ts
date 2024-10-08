import { updateLeftDays } from './controller';

export const POST = async () => {
    const res = await updateLeftDays();
    return res
};
