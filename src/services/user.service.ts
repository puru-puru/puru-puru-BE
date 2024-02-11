import { Request, Response, NextFunction } from 'express'
import { Users } from '../../models/Users'
import { UserRepository } from '../repositories/user.repository'


export class UserService {
    userRepository = new UserRepository()

    setName = async (nickname: string, user: any) => {
        try {
            const setName = await this.userRepository.setName(
                nickname,
                user
            )
        } catch (err) {
            throw err;
        }
    }
}