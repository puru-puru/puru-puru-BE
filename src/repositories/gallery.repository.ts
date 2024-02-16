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
  
      const galleryWithUrls = gallery.map((item) => ({
        id: item.id,
        // image: item.image,
        imageUrl: `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${item.image}`,
      }));
  
      return galleryWithUrls;
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
        throw new Error("이미지 업로드에 실패했습니다.");
      }
  
      return uploadedImage;
    } catch (err) {
      throw err;
    }
  };
}