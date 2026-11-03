import { email, z } from 'zod';

export const registerSchema = z.object({
    name: z.string().trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100,'Name must be at most 100 characters long'),

    email: z.string().trim()
    .email('Invalid email format')
    .max(255),

    password: z.string().trim()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be at most 100 characters long')
});

export const loginSchema = z.object({
    email: z.string().trim()
    .email('Invalid email format'),

    password: z.string().trim()
    .min(1, 'Password is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;