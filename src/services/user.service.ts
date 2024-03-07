import { Request, Response, NextFunction } from "express";
import { Users } from "../../models/Users";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    userRepository = new UserRepository();

    // 닉네임 설정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    setName = async (nickname: string, user: any) => {
        try {
          // 받아온 닉네임 값을 디미 안에 찾아 봄.
            const isExistName = await Users.findOne({
                where: { nickname },
            });
            if (isExistName) { // 받은 값이 디비 안에 있는 것 과 일치 한다면 에러 핸들링.
                throw { name: "ExistName" };
            }
            // 뚫고 옴에 따라 이제 레포 부분에서 불러옴. 
            const setName = await this.userRepository.updateUser(
                { nickname },
                { where: { userId: user.userId } }
            );
            // 리턴
            return { setName };
        } catch (err) {
            throw err;
        }
    };

    // 내 정보 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    userInfo = async (userId: number) => {
        try {
          // 유저 아이디의 고유 값을 찾는 부분. 
            const userInfo = await this.userRepository.findPkUser(userId);

            if (!userInfo) {
                throw new Error("로그인한 사용자를 찾을 수 없습니다.");
            }

            // 보여줄 데이터 들.
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
