import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, 'Name cannot be empty').max(50),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }),
});
