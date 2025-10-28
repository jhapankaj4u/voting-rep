import { Router } from 'express';
import { createReview, voteReview } from '../controllers/reviewController';
import { auth } from '../middleware/auth';
import { validate } from '../utils/validate';
import { createReviewSchema, voteSchema } from '../validators/review';

const router = Router();
router.post('/', auth, validate(createReviewSchema), createReview);
router.patch('/:id/vote', auth, validate(voteSchema), voteReview);
export default router;
