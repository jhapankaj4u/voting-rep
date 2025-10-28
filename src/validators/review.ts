import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(500).optional()
  })
});

export const voteSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ vote: z.enum(['up','down']) })
});
