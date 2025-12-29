import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  website: String,
  address: {
    street: String,
    suite: String,
    city: String,
    zipcode: String
  },
  company: {
    name: String,
    catchPhrase: String,
    bs: String
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
