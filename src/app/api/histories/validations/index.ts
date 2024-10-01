import { z } from 'zod';


// Zod schema for History model
export const HistorySchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name is required' }),
    phone: z
        .string({ required_error: 'Phone is required' })
        .min(1, { message: 'Phone is required' }),
    serviceId: z
        .string({ required_error: 'Service ID is required' })
        .uuid({ message: 'Invalid service ID' }),
    providerId: z
        .string({ required_error: 'Provider ID is required' })
        .uuid({ message: 'Invalid provider ID' }),
    lastExpire: z
        .string({ required_error: 'Last expire date is required' })
        .min(1, { message: 'Last expire date is required' }),
});

export type THistoryValidation = z.infer<typeof HistorySchema>;