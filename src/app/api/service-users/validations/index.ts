import { z } from 'zod';

// Create Zod schema for ServiceUser model
export const ServiceUserSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name is required' }), // Non-empty string
    phone: z
        .string({ required_error: 'Phone is required' })
        .min(1, { message: 'Phone is required' }), // Non-empty string
    joinDate: z.string({ required_error: 'Join Date is required' }),
    endDate: z.string({ required_error: 'End Date is required' }),
    status: z
        .string({ required_error: 'Status is required' })
        .min(1, { message: 'Status is required' }), // Non-empty string
    type: z.string({ required_error: 'Type is required' }).min(1, { message: 'Type is required' }), // Non-empty string
    serviceId: z
        .string({ required_error: 'Service ID is required' })
        .min(1, { message: 'Service ID is required' })
        .uuid({ message: 'Invalid Service ID ' }), // Non-empty string
    serviceAccountId: z
        .string({ required_error: 'Service Account ID is required' })
        .min(1, { message: 'Service Account ID is required' })
        .uuid({ message: 'Invalid Service Account ID ' }), // Non-empty string
});

export type TServiceUserValidation = z.infer<typeof ServiceUserSchema>;
