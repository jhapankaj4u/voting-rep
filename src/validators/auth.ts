import { z } from 'zod';

const passwordRegex = /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

export const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3).regex(/^[a-zA-Z0-9]+$/, 'alphanumeric only'),
    email: z.string().email(),
    password: z.string().min(8).regex(passwordRegex, 'must include uppercase, number and symbol')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});
