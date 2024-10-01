'use server';

import { revalidatePath } from "next/cache";
import { tryCatch } from "@/lib/trycatch";


export const updateLeftDaysCalculationSeviceAccunts = async () => {
    const [data, error] = await tryCatch('service-accounts?is-update-left-days=true');
    revalidatePath('/dashboard');
    return { data, error: error?.message };
}
export const updateLeftDaysCalculationSeviceUsers = async () => {
    const [data, error] = await tryCatch('service-users?is-update-left-days=true');
    revalidatePath('/dashboard');
    return { data, error: error?.message };
}