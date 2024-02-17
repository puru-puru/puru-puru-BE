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


  // 이미지 업로드
  uploadImage = async (user: any, diaryId: any, imageUrl: string) => {
    try {
      const uploadedImage = await this.galleryRepository.uploadImage(user, diaryId, imageUrl);

      return uploadedImage;
    } catch (err) {
      throw err;
    }
  };

  deleteGallery = async (user: any, galleryId: any) => {
    try {
      const foundGallery = await this.galleryRepository.findGallery({ where: { id: galleryId } });
  
      if (!foundGallery) {
        throw { name: "GalleryNotFound" };
      }
  
      const deleteGallery = await this.galleryRepository.deleteGallery(galleryId);
  
      return deleteGallery;
    } catch (err) {
      throw err;
    }
  };
}