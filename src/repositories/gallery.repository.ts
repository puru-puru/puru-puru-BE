import { Galleries } from "../../models/Galleries";

export class GalleryRepository {

    getGalleries = async (user: any) => {
        try {
            const getGalleries = await Galleries.findAll({
                where: {
                    deletedAt: null,
                    id: user.id
                }
            })
            if(!getGalleries) {
                throw { name: "Nopic" }
            }
            return getGalleries
        } catch (err) {
            throw err;
        }
    }

    uploadGallery = async (data: any, options: any) => {
        try {
            const uploadGallery = await Galleries.create(options)
            
            if(!uploadGallery) {
                return null;
            }
            return uploadGallery
        } catch (err) {
            throw err;
        }
    }
}