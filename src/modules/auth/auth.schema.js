import { z } from 'zod';

export const registerUserValidatorSchema = z.object({
    email: z.email({ message: 'Please provide a valid email address' }),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const loginUserValidatorSchema = z.object({
    email: z.email({ message: 'Please provide a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});