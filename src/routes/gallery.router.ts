import express from 'express'
import { GalleryController } from '../controllers/gallery.controller' 
import authMiddleware from '../middlewares/auth.middleware'
import upload from '../../assets/upload'

const router = express.Router()
const galleryController = new GalleryController()

// 사용자 사진 전체 조회
router.get("/galleries", authMiddleware, galleryController.getGalleries)

// 사용자 사진 등록
router.post("/galleries", authMiddleware, upload.single('image'), galleryController.uploadGallery)

export default router;