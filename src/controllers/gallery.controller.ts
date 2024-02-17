import { GalleryService } from "../services/gallery.service";
import { Request, Response, NextFunction } from "express";

export class GalleryController {
  galleryService = new GalleryService();

  getGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { diaryId } = req.params;
      const user: any = req.user;

      const gallery = await this.galleryService.getGallery(user, diaryId);

      return res.status(200).json({ data: gallery });
    } catch (err) {
      next(err);
    }
  };

  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { diaryId } = req.params;
      const user: any = req.user;
      const imageUrl = (req.file as any)?.location;

      if (!imageUrl) {
        throw new Error("이미지 URL이 없습니다.");
      }

      await this.galleryService.uploadImage(user, diaryId, imageUrl);

      return res.status(200).json({message: "이미지 등록 완료",data: { imageUrl: imageUrl }});
    } catch (err) {
      next(err);
    }
  };

  deleteGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { galleryId } = req.params
      const user: any = req.user;

      const gallery = await this.galleryService.deleteGallery(user, galleryId)

      return res.status(200).json({ message: "삭제 완료" })
    } catch (err) {
      next(err)
    }
  }
}
