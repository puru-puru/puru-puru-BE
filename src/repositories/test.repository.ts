import { Plants } from "../../models/Plants";
import { Users } from "../../models/Users";

export class TestRepository {

   getNickName = async () => {
        try {
            const boards = await Users.findAll({
                where: {
                    deletedAt: null
                }
            })
            return boards
        } catch (err) {
            throw err;
        }
    }

    getTestResult = async () => {
        try {
            const boards = await Plants.findAll({
                where: {
                    deletedAt: null
                }
            })
            return boards
        } catch (err) {
            throw err;
        }
    }

}