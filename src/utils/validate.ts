import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const parseResult = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!parseResult.success) {
    const issues = parseResult.error.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
    return res.status(400).json({ errors: issues });
  }
 
 
  if (parseResult.data.body) req.body = parseResult.data.body;
  if (parseResult.data.query) req.query = parseResult.data.query as any;
  if (parseResult.data.params) req.params = parseResult.data.params as any;
  next();
};
