import { Request, Response } from 'express';
import Book from '../models/Book';
import Review from '../models/Review';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';

// create
export const createBook = async (req: AuthRequest, res: Response) => {
  const { title, author, genre, year, summary } = req.body;
  try {
    const book = await Book.create({ title, author, genre, year, summary, createdBy: req.userId });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// list with aggregation
export const listBooks = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 10);
  const genre = req.query.genre as string | undefined;
  const sort = req.query.sort as string | undefined;

  try {
    const match: any = {};
    if (genre) match.genre = genre;

    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'bookId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: { $cond: [{ $gt: [{ $size: '$reviews' }, 0] }, { $avg: '$reviews.rating' }, null] },
          totalReviews: { $size: '$reviews' }
        }
      },
      { $project: { reviews: 0 } }
    ];

    if (sort === 'rating_desc') pipeline.push({ $sort: { averageRating: -1 } });
    else pipeline.push({ $sort: { createdAt: -1 } });

    pipeline.push({ $skip: (page-1)*limit }, { $limit: limit });

    const result = await Book.aggregate(pipeline);
    res.json({ page, limit, results: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get book details
export const getBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const book = await Book.findById(id).lean();
    if (!book) return res.status(404).json({ message: 'Not found' });

    const reviews = await Review.find({ bookId: id }).populate('userId', 'username').lean();
    const avg = reviews.length ? reviews.reduce((s,r:any)=>s+r.rating,0)/reviews.length : null;

    res.json({ book, reviews: reviews.map(r=>({ id:r._id, rating:r.rating, comment:r.comment, user: (r.userId as any).username })), aggregate: { averageRating: avg, totalReviews: reviews.length } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
