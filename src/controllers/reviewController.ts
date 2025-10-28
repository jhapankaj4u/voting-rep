import { Request, Response } from 'express';
import Review from '../models/Review';
import Vote from '../models/Vote';
import Book from '../models/Book';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';

// create review
export const createReview = async (req: AuthRequest, res: Response) => {
  const { bookId, rating, comment } = req.body;
  if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid bookId' });
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existing = await Review.findOne({ bookId, userId: req.userId });
    if (existing) return res.status(409).json({ message: 'User already reviewed this book' });

    const review = await Review.create({ bookId, userId: req.userId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// vote
export const voteReview = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { vote } = req.body as { vote: 'up'|'down' };
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid review id' });
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const v = vote === 'up' ? 1 : -1;
    try {
      const created = await Vote.create({ reviewId: id, userId: req.userId, vote: v });
      return res.json({ message: 'Voted', vote: created.vote });
    } catch (err:any) {
      // if duplicate key, user already voted - respond conflict
      if (err.code === 11000) return res.status(409).json({ message: 'User already voted on this review' });
      throw err;
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
