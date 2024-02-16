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
      await this.galleryRepository.uploadImage(user, diaryId, imageUrl);

      return "이미지 업로드 완료";

    } catch (err) {
      throw err;
    }
  };
}
