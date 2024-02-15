import { Request, Response, NextFunction } from 'express'
import { GalleryRepository } from '../repositories/gallery.repository'
import { Galleries } from '../../models/Galleries'

export class GalleryService{
    galleryRepository = new GalleryRepository()

    getGalleries = async (user: any) => {
        try {
            const getGalleries = await this.galleryRepository.getGalleries(user)

            return getGalleries
        } catch (err) {
            throw err;
        }
    }

    uploadGallery = async (user: any, imageUrl: any) => {
        try {
            const uploadGallery = await this.galleryRepository.uploadGallery(user, imageUrl)

            return uploadGallery
        } catch (err) {
            throw err;
        }
    }
}