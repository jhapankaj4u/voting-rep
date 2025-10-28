import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthSignupBody } from '../types';

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req: Request, res: Response) => {
  const body = req.body as AuthSignupBody;
  try {
    const existing = await User.findOne({ $or: [{ email: body.email }, { username: body.username }] });
    if (existing) return res.status(409).json({ message: 'Email or username already taken' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.password, salt);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set in environment");
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const signOptions: any =   { expiresIn: parseInt(process.env.JWT_EXPIRES || "3600", 10) }

    
    const user = await User.create({ username: body.username, email: body.email, passwordHash: hash });


    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, signOptions);
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const signOptions: any =   { expiresIn: parseInt(process.env.JWT_EXPIRES || "3600", 10) }

    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, signOptions);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
