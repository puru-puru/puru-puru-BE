import { CreatedAt } from "sequelize-typescript";
import { Plants } from "../../models/plants";
import { Users } from "../../models/Users";

export class TestRepository {

   getNickName = async () => {
        try {
            
        } catch (err) {
            throw err;
        }
    }
    
    getDB = async () => {
        try {
            const plants = await Plants.findAll({
                attributes: {exclude: ['createdAt','updatedAt', 'deletedAt']}
            });

            return plants
        } catch (err) {
            throw err;
        }
    }

}