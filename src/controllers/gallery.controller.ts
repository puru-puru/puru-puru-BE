import { GalleryService } from '../services/gallery.service'
import { Request, Response, NextFunction } from 'express'

export class GalleryController{
    galleryService = new GalleryService()

    getGalleries = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: any = req.user;

            const getGalleries = await this.galleryService.getGalleries(user)

            return res.status(200).json({ data: getGalleries })
        } catch (err) {
            next(err)
        }
    }

    uploadGallery = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: any = req.user
            const imageUrl = req.file
            await this.galleryService.uploadGallery(user, imageUrl)
            return res.status(200).json({ message: "이미지 등록 완료" })
        } catch (err) {
            next(err)
        }
    }
}