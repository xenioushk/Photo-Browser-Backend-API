import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const photoSchema = new Schema<IPhoto>({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  albumId: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IPhoto>('Photo', photoSchema);
