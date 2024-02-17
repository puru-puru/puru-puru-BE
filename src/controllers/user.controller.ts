import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service'
import Joi from 'joi'

const userSchema = Joi.object({
    nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,8}$"))
})

export class UserController {
    userService = new UserService()

    setName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { nickname } = await userSchema.validateAsync(req.body)
            const user: any = req.user;
            const setName = await this.userService.setName(nickname, user)

            return res.status(200).json({ message: "닉네임 설정이 완료 되었움"})
        } catch (err) {
            next(err)
        }
    }

    getUser = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const user: any = req.user
            
            if(!user) {
                return res.status(404).json({  message: "사용자 정보를 찾을 수 없습니다." })
            }

            const userData = await this.userService.userInfo(user.userId);

            return res.status(200).json({ data: userData })
        } catch (err) {
            next(err)
        }
    }
}