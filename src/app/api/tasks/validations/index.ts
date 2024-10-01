import { z } from 'zod';

// Define the TaskStatus enum
const TaskStatusEnum = z.enum(['pending', 'solved']);

// Create Zod schema for the Task model
const ElevenDigitStringSchema = z.string().regex(/^\d{11}$/, {
    message: 'Enter a valid 11-digit number',
});
export const TaskSchema = z.object({
    number: ElevenDigitStringSchema,
    serviceId: z.string({ required_error: 'Service ID is required' }).uuid({
        message: 'Invalid Service ID ',
    }),
    serviceAccountId: z.string({ required_error: 'Service Account ID is required' }).uuid({
        message: 'Invalid Service Account ID ',
    }),
    description: z.string().min(1, { message: 'Description is required' }),
    status: TaskStatusEnum,
});

export type TTaskValidation = z.infer<typeof TaskSchema>;
