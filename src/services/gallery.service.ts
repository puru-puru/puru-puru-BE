import { Request, Response, NextFunction } from "express";
import { GalleryRepository } from "../repositories/gallery.repository";
import { Galleries } from "../../models/Galleries";

export class GalleryService {
  galleryRepository = new GalleryRepository();

  getGallery = async (user: any, diaryId: any) => {
    try {
      const gallery = await this.galleryRepository.getGallery(user, diaryId);

      return gallery;
      
    } catch (err) {
      throw err;
    }
  };

  uploadImage = async (user: any, diaryId: any, imageUrl: string) => {
    try {
      const uploadedImage = await this.galleryRepository.uploadImage(user, diaryId, imageUrl);
  
      return {
        message: "이미지 업로드 완료",
        data: {
          id: uploadedImage.id,
          image: `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${uploadedImage.image}`,
        },
      };
    } catch (err) {
      throw err;
    }
  };
}