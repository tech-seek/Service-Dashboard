'use client';
import { useState } from "react";

export const useDateField = (initialDate: string | undefined) => {
    const [date, setDate] = useState<Date | undefined>(
        initialDate ? new Date(initialDate) : undefined,
    );
    return { selectedDate: date, setSelectedDate: setDate };
};
