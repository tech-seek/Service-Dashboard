import { clsx, type ClassValue } from 'clsx';
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { twMerge } from 'tailwind-merge';
import { BDT_TIMEZONE } from './timeZone';


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper function to calculate left days
export const calculateLeftDays = (endDate: string): number => {
    // Get the current date
    const currentDate = new Date();

    // Convert the current date to the BDT timezone and start of the day
    const currentDateBDT = startOfDay(toZonedTime(currentDate, BDT_TIMEZONE));

    // Parse the endDate and convert it to BDT timezone, also at the start of the day
    const end = parseISO(endDate);
    const endDateBDT = startOfDay(toZonedTime(end, BDT_TIMEZONE));

    // Calculate the difference in calendar days between the two BDT dates
    const daysLeft = differenceInCalendarDays(endDateBDT, currentDateBDT);

    // Allow leftDays to be 0 if today is the end date
    return Math.max(daysLeft, 0);  // No need for 1 minimum, allow 0
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

// export const calculateLeftDays = (endDate: string) => {
//     // Get the current date
//     const currentDate = new Date();

//     // Convert the current date to BDT timezone
//     // Convert the current date to BDT timezone
//     const currentDateBDT = toZonedTime(currentDate, BDT_TIMEZONE);

//     // Convert the endDate to a Date object and then to BDT timezone
//     const end = parseISO(endDate);
//     const endDateBDT = toZonedTime(end, BDT_TIMEZONE);

//     // Calculate the difference in calendar days between the two BDT dates
//     const daysLeft = differenceInDays(endDateBDT, currentDateBDT);

//     // Check if we are still before the end date during the same day
//     if (isBefore(currentDateBDT, endDateBDT)) {
//         return Math.max(daysLeft, 1); // Ensure it shows at least 1 day
//     }

//     return Math.max(daysLeft, 0);
// };