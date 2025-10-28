import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

const jwtSec = process.env.JWT_SECRET;

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, jwtSec!) as any;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
