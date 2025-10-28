import { z } from 'zod';

const currentYear = new Date().getFullYear();
const genres = ['Programming','Fiction','Science','History'] as const;

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    author: z.string().min(1),
    genre: z.enum(genres),
    year: z.number().int().gte(1800).lte(currentYear),
    summary: z.string().max(500).optional()
  })
});
