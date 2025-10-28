import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

UserSchema.methods.comparePassword = function(candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
