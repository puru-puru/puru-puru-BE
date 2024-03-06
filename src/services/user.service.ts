import { Request, Response, NextFunction } from "express";
import { Users } from "../../models/Users";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    userRepository = new UserRepository();

    // 닉네임 설정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    setName = async (nickname: string, user: any) => {
        try {
            const isExistName = await Users.findOne({
                where: { nickname },
            });
            if (isExistName) {
                throw { name: "ExistName" };
            }
            const setName = await this.userRepository.updateUser(
                { nickname },
                { where: { userId: user.userId } }
            );
            return { setName };
        } catch (err) {
            throw err;
        }
    };

    // 내 정보 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    userInfo = async (userId: number) => {
        try {
            const userInfo = await this.userRepository.findPkUser(userId);

            if (!userInfo) {
                throw new Error("로그인한 사용자를 찾을 수 없습니다.");
            }

            const userData = {
                userId: userInfo.userId,
                nickname: userInfo.nickname,
                email: userInfo.email,
            };

            return userData;
        } catch (err) {
            throw err;
        }
    };

    // 회원 탈퇴 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    deleteUser = async (userId: any) => {
        try {
            const deleteUser = await Users.destroy({ where: { userId } });

            return deleteUser;
        } catch (err) {
            throw err;
        }
    };

    // 닉네임 변경 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    changeName = async (nickname: string, user: any) => {
        try {
            const isExistName = await Users.findOne({
                where: { nickname },
            });
            if (isExistName) {
                throw { name: "ExistName" };
            }
            const change = await this.userRepository.updateUser(
                { nickname },
                { where: { userId: user.userId } }
            );
            return { change };
        } catch (err) {
            throw err;
        }
    };
}
