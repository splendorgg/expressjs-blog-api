import { z } from 'zod';
export const UserTypeEnum = z.enum(['USER', 'ADMIN'], {
    error: 'User type must be either USER or ADMIN',
});

export const userValidatorSchema = z.object({
    id: z.uuid({ message: 'User ID must be a valid UUID' }),
    keycloakId: z.string().min(1, { message: 'Keycloak ID is required' }),
    email: z.email({ message: 'Please provide a valid email address' }),
    firstName: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters' })
        .max(50, { message: 'First name must be at most 50 characters' }),
    lastName: z
        .string()
        .min(2, { message: 'Last name must be at least 2 characters' })
        .max(50, { message: 'Last name must be at most 50 characters' }),
    role: UserTypeEnum,
    createdAt: z.iso.datetime({ message: 'Invalid date format' }),
});

export const createUserValidatorSchema = z.object({
    keycloakId: z.string().min(1),
    email: z.email(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    role: UserTypeEnum.default('USER'),
});