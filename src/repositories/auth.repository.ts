import { Users } from '../../models/Users'

export class AuthRepository {
    signupUser = async (nickname: string, email: string, password: string) => {
        const signupUser = await Users.create({
            nickname,
            email,    
            password
        })
        return signupUser
    }

    loginUser = async (email: string, password: string) => {
        const loginUser = await Users.findOne({
            where: { email },
        })
        return loginUser
    }
}
