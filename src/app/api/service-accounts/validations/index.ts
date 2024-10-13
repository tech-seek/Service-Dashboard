import { z } from 'zod';

// ServiceAccount validation schema
export const ServiceAccountSchema = z.object({
    email: z.string({ required_error: 'Email is required' }),
    joinDate: z.string({ required_error: 'Join Date is required' }),
    endDate: z.string({ required_error: 'End Date is required' }),
    status: z
        .string({ required_error: 'Status is required' })
        .min(1, { message: 'Status is required' }),
    serviceId: z
        .string({ required_error: 'Service ID is required' })
        .min(1, { message: 'Service ID is required' })
        .uuid({ message: 'Invalid Service ID ' }),
    dealerId: z
        .string({ required_error: 'Dealer ID is required' })
        .min(1, { message: 'Dealer ID is required' })
        .uuid({ message: 'Invalid Dealer ID ' }),
});

export type TServiceAccountPayload = z.infer<typeof ServiceAccountSchema>;
