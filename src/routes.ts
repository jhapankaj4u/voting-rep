import { Router } from 'express';
import authRouter from './routes/auth';
import booksRouter from './routes/books';
import reviewsRouter from './routes/reviews';

const router = Router();
router.use('/auth', authRouter);
router.use('/books', booksRouter);
router.use('/reviews', reviewsRouter);
export default router;
