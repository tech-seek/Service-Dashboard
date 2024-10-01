import { clsx, type ClassValue } from 'clsx';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper function to calculate left days

export const calculateLeftDays = (endDate: string) => {
    // Get the current date
    const currentDate = new Date();

    // Convert the endDate to ISO format if not already
    const end = parseISO(endDate);

    // Calculate the difference in calendar days
    const daysLeft = differenceInCalendarDays(end, currentDate);
    return Math.max(daysLeft, 0);
};

export const IdGenerator = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const convertToLocalDateFormat = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
