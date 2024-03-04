import { CreatedAt } from "sequelize-typescript";
import { Missions } from "../../models/Missions";
import { RecommendPlants } from "../../models/RecommendPlants";
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
            const plants = await RecommendPlants.findAll({
                attributes: {exclude: ['createdAt','updatedAt', 'deletedAt']}
            });
            return plants
        } catch (err) {
            throw err;
        }
    }
}