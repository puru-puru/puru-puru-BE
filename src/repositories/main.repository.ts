import { CreatedAt } from "sequelize-typescript";
import { Missions } from "../../models/Missions";
import { Plants } from "../../models/plants";
import {Op} from "sequelize";

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

    getSelectedDB = async () => {
        try {
            const plants = await Plants.findAll({
                where: {
                    tag: {
                        [Op.notLike]: '%#신규식물'
                    }
                },
                attributes: {exclude: ['createdAt','updatedAt', 'deletedAt']}
            });
            return plants
        } catch (err) {
            throw err;
        }
    }
}