import { Request, Response } from 'express';
import Photo from '../models/Photo';
import Album from '../models/Album';

// GET /api/photos?_page=1&_limit=18
export const getPhotos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 18;
    const skip = (page - 1) * limit;

    const photos = await Photo.find()
      .skip(skip)
      .limit(limit)
      .populate('albumId', 'title')
      .populate('userId', 'name email');

    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
};

// GET /api/photos/:id
export const getPhotoById = async (req: Request, res: Response) => {
  try {
    const photo = await Photo.findOne({ id: parseInt(req.params.id) })
      .populate('albumId')
      .populate('userId');

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
};

// GET /api/albums/:albumId/photos?_page=1&_limit=18
export const getPhotosByAlbum = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 18;
    const skip = (page - 1) * limit;

    const album = await Album.findOne({ id: parseInt(req.params.albumId) });
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const photos = await Photo.find({ albumId: album._id })
      .skip(skip)
      .limit(limit);

    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
};
