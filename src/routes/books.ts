import { Router } from 'express';
import { createBook, listBooks, getBook } from '../controllers/bookController';
import { auth } from '../middleware/auth';
import { validate } from '../utils/validate';
import { createBookSchema } from '../validators/book';

const router = Router();
router.post('/', auth, validate(createBookSchema), createBook);
router.get('/', listBooks);
router.get('/:id', getBook);
export default router;
