import express from 'express';
import { getPhotos, getPhotoById, getPhotosByAlbum } from '../controllers/photoController';

const router = express.Router();

router.get('/', getPhotos);
router.get('/:id', getPhotoById);

export default router;
