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
      const imageUrl = (req.file as any)?.key;

      if (!imageUrl) {
        throw new Error("이미지 URL이 없습니다.");
      }

      await this.galleryService.uploadImage(user, diaryId, imageUrl);

      return res
        .status(200)
        .json({ message: "이미지 등록 완료", data: imageUrl });
    } catch (err) {
      next(err);
    }
  };
}
