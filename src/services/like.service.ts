import { Likes } from "../../models/likes";
import { Users } from "../../models/Users";
import { Boards } from "../../models/Boards";
import { LikeRepository } from "../repositories/like.repository";

export class LikeService {
    likeRepository = new LikeRepository()

    likePost = async (userId: any, boardId: any) => {
        try {
            const addLike = await this.likeRepository.likePost(userId, boardId);

            return addLike;
        } catch (err) {
            throw err;
        }
    }


    // 게시물에 좋아요 취소
    removeLike = async (userId: any, boardId: any) => {
        try {
            const unLike = await this.likeRepository.removeLike(userId, boardId);

            return unLike
        } catch (err) {
            throw err;
        }
    }


}