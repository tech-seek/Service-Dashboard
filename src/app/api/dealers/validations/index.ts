import { z } from 'zod';

// Create Zod schema for Dealer model
export const DealerSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name is required' }), // Non-empty string
});

export type TDealerValidation = z.infer<typeof DealerSchema>;
