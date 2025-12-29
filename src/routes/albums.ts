import express from 'express';
import { getAlbums, getAlbumById } from '../controllers/albumController';
import { getPhotosByAlbum } from '../controllers/photoController';

const router = express.Router();

router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.get('/:albumId/photos', getPhotosByAlbum);

export default router;
