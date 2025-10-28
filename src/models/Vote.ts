import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  reviewId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  vote: number; // 1 or -1
}

const VoteSchema = new Schema<IVote>({
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vote: { type: Number, enum: [1,-1], required: true }
}, { timestamps: true });

// One vote per user per review
VoteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IVote>('Vote', VoteSchema);
