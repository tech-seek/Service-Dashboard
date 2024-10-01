import { z } from 'zod';

export const ServiceSchema = z.object({
    name: z.string().min(1, { message: 'Service name is required' }),
});

export type TServiceValidation = z.infer<typeof ServiceSchema>;
