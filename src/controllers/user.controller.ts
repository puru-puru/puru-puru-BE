import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service'
import Joi from 'joi'

const userSchema = Joi.object({
    nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,8}$"))
})

export class UserController {
    userService = new UserService()

    // 닉네임 설정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    setName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { nickname } = await userSchema.validateAsync(req.body)
            const user: any = req.user;
            const setName = await this.userService.setName(nickname, user)

            return res.status(200).json({ message: "닉네임 설정이 완료 되었움"})
        } catch (err: any) {
            next(err);
        }
    }

    // 내 정보 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    getUser = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const user: any = req.user
            
            if(!user) {
                throw { name: "UserNotFound" }
            }

            const userData = await this.userService.userInfo(user.userId);

            return res.status(200).json({ data: userData })
        } catch (err) {
            next(err)
        }
    }

    // 회원 탈퇴 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: any = req.user;
    
            if(!user) {
                throw { name: "UserNotFound" }
            }
    
            const deleted = await this.userService.deleteUser(user.userId);
    
            if (deleted) {
                return res.status(200).json({ message: "회원 탈퇴 성공" });
            } else {
                return res.status(404).json({ message: "회원 탈퇴 실패. 사용자를 찾을 수 없거나 이미 삭제된 사용자입니다." });
            }
        } catch (err) {
            next(err);
        }
    }

        // 닉네임 변경 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        changeName = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { nickname } = await userSchema.validateAsync(req.body)
                const user: any = req.user;

                const change = await this.userService.changeName(nickname, user)

                return res.status(200).json({ message: "닉네임 변경 완료"})
            } catch (err) {
                next (err);
            }
        }
}