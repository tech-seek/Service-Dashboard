import { z } from 'zod';
import { FormFieldConfig } from '@/components/ui/customForm/customForm';


export const ADD_MODERETOR_FORM_FIELDS: FormFieldConfig[] = [
    {
        name: 'name',
        fieldType: 'input',
        validation: z.string().min(1, { message: 'Please enter the seller name.' }),
        placeholder: 'Enter your user name',
        type: 'text',
        className: 'rounded-sm py-2.5',
    },
    {
        name: 'password',
        fieldType: 'input',
        validation: z.string().min(1, { message: 'Please enter the password.' }),
        placeholder: 'Enter your password',
        type: 'text',
        className: 'rounded-sm py-2.5',
    },
];