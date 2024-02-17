import { Galleries } from "../../models/Galleries";

export class GalleryRepository {

  getGallery = async (user: any, diaryId: any) => {
    try {
      const gallery = await Galleries.findAll({
        where: {
          deletedAt: null,
          diaryId: diaryId,
        },
      });

      if (!gallery) {
        throw { name: "Nopic" };
      }

      return gallery;
    } catch (err) {
      throw err;
    }
  };


findGallery = async (options: any) => {
  try {
    const foundGallery = await Galleries.findOne(options);
    return foundGallery;
  } catch (err) {
    throw err;
  }
};
  

  uploadImage = async (user: any, diaryId: any, imageUrl: string) => {
    try {
      const uploadedImage = await Galleries.create({
        image: imageUrl,
        diaryId: diaryId,
      });

      if (!uploadedImage) {
        throw { name: "FailUpload" };
      }

      return uploadedImage;
    } catch (err) {
      throw err;
    }
  };

  deleteGallery = async (galleryId: any) => {
    try {
      const deleteGallery = await Galleries.destroy({
        where: {
          id: galleryId,
        },
      });
  
      return deleteGallery;
    } catch (err) {
      throw err;
    }
  };
}