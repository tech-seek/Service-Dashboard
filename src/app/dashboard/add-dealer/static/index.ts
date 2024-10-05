import { z } from 'zod';
import { FormFieldConfig } from '@/components/ui/customForm/customForm';

export const ADD_DEALER_FORM_FIELDS: FormFieldConfig[] = [
    {
        name: 'name',
        fieldType: 'input',
        validation: z.string().min(1, { message: 'Please enter the Dealer name.' }),
        placeholder: 'Enter your Dealer name',
        type: 'text',
        className: 'rounded-sm py-2.5',
    }
];
