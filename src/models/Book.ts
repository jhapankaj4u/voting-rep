import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  year: number;
  summary?: string;
  createdBy: mongoose.Types.ObjectId;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true, index: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  summary: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IBook>('Book', BookSchema);
