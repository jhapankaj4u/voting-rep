import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
}

const ReviewSchema = new Schema<IReview>({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min:1, max:5 },
  comment: { type: String }
}, { timestamps: true });

// Unique review per user per book
ReviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);
