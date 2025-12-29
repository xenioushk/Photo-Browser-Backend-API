import { Request, Response } from 'express';
import Album from '../models/Album';

// GET /api/albums?_page=1&_limit=18
export const getAlbums = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 18;
    const skip = (page - 1) * limit;

    const albums = await Album.find()
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
};

// GET /api/albums/:id
export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const album = await Album.findOne({ id: parseInt(req.params.id) })
      .populate('userId');

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch album' });
  }
};
