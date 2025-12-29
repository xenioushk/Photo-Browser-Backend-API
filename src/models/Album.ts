import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  id: number;
  title: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const albumSchema = new Schema<IAlbum>({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IAlbum>('Album', albumSchema);
