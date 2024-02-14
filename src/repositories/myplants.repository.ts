import { CreatedAt } from "sequelize-typescript";
import { Diaries } from "../../models/Diaries";

export class MyplantsRepository {

    postMyPlant = async (image: string, name: string, plantAt: Date, user: any) => {
        try {
            await Diaries.create({
                image,
                name,
                plantAt,
                id: user.id
            });
            return {"Message": "나의 반려 식물이 등록되었습니다"}

        } catch (err) {
            throw err;
        }
    }

    showMyPlants = async (user: any) => {
        try {
            const MyPlants = await Diaries.findAll({
                where: {
                    deletedAt: null,
                    id: user.id
                },
                attributes: {
                    exclude: ['diaryId', 'createdAt', 'updatedAt', 'deletedAt', 'id']
                }
            });
            return MyPlants;

        } catch (err) {
            throw err;
        }
    }

}