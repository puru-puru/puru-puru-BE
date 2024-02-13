import { CreatedAt } from "sequelize-typescript";
import { Missions } from "../../models/Missions";

export class MainRepository {

   getInfo = async () => {
        try {
            const missions = await Missions.findAll({
                attributes: {exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt']}
            });
            return missions;
        } catch (err) {
            throw err;
        }
    }


}