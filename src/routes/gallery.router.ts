import express from 'express'
import { GalleryController } from '../controllers/gallery.controller' 
import authMiddleware from '../middlewares/auth.middleware'
import upload from '../../assets/upload' 

const router = express.Router()
const galleryController = new GalleryController()

// 사용자 사진 전체 조회
router.get("/galleries/:diaryId", authMiddleware, galleryController.getGallery)

// 사용자 사진 등록
router.post("/galleries/:diaryId", authMiddleware, upload.single('image'), galleryController.uploadImage)

// 등록 사진 삭제.
router.delete('/galleries/:galleryId', authMiddleware, galleryController.deleteGallery)

export default router;  