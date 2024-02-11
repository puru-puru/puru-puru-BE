import { Users } from "../../models/Users";

export class UserRepository{

    setName = async ( nickname: string, user: any ) => {
        try {
            await Users.update({ nickname }, { where: { id: user.id } })
        } catch (err) {
            throw err;
        }
    }
}