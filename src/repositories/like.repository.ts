// repositories/like.repository.t
import { Likes } from "../../models/likes";

export class LikeRepository {
    likePost = async (userId: any, boardId: any) => {
        try {
            // 이미 좋아요를 눌렀는지 확인
            const existingLike = await Likes.findOne({
                where: { userId, boardId },
            });

            if (existingLike) {
                // 이미 좋아요를 누른 경우
                return { message: '이미 좋아요를 눌렀습니다.' };
            }

            // 좋아요 생성
            await Likes.create({
                userId,
                boardId,
            });

            return { message: '게시물에 좋아요를 눌렀습니다.' };
        } catch (err) {
            throw err;
        }
    }

    // 게시물에 좋아요 취소
    removeLike = async (userId: any, boardId: any) => {
        await Likes.destroy({
            where: {
                userId,
                boardId,
            },
        });
    }
}
