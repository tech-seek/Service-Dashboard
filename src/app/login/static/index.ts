import { FormFieldConfig } from "@/components/ui/customForm/customForm";
import { z } from "zod";

export const loginFromFields: FormFieldConfig[] = [
    {
        name: 'userName',
        type: 'text',
        validation: z
            .string()
            .min(1, { message: 'Please enter your username' })
            .max(255, { message: 'Username should be less than 255 characters' }),
        placeholder: 'Username',
    },
    {
        name: 'password',
        type: 'password',
        validation: z
            .string()
            .min(1, { message: 'Please enter your password' })
            .max(255, { message: 'Password should be less than 255 characters' }),
        placeholder: 'Password',
    },
];
