import { Galleries } from "../../models/Galleries";

export class GalleryRepository {
  getGallery = async (user: any, diaryId: any) => {
    try {
      const gallery = await Galleries.findAll({
        where: {
          deletedAt: null,
        //   id: user.id,
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

  uploadImage = async (user: any, diaryId: any, imageUrl: string) => {
    try {
      const uploadImage = await Galleries.create({
        image: imageUrl,
        diaryId: diaryId,
      });

      if (!uploadImage) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      return uploadImage;
    } catch (err) {
      throw err;
    }
  };
}
