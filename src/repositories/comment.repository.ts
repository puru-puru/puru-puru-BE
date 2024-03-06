import { Comments } from "../../models/Comments";

export class CommentRepository {


    postComment = async (content: string, boardId: any, user: any) => {
        try {
            await Comments.create({
                boardId,
                content,
                userId: user.userId
            })

            return { "Message": "댓글을 작성했습니다" }

        } catch (err) {
            throw err;
        }
    }


    updateComment = async (content: string, commentId: any, boardId: any, user: any) => {
        try {
            const comment = await Comments.update({ content },
                {
                    where: {
                        id: commentId,
                        userId: user.userId
                    }
                })

            if (!comment) {
                return { "Message": "해당 댓글은 존재하지 않거나 삭제권한이 없습니다" }
            }

            return { "Message": "댓글을 수정했습니다" }

        } catch (err) {
            throw err;
        }
    }


    deleteComment = async (content: string, commentId: any, boardId: any, user: any) => {
        try {
            const comment = await Comments.update({ deletedAt: 'deleted' },
                {
                    where: {
                        id: commentId,
                        userId: user.userId
                    }
                })

            if (!comment) {
                return { "Message": "해당 댓글은 존재하지 않거나 삭제권한이 없습니다" }
            }

            return { "Message": "댓글을 삭제했습니다" }

        } catch (err) {
            throw err;
        }
    }

    postComment2 = async (content: string, boardId: any, user: any, commentId: any) => {
        try {
            await Comments.create({
                boardId,
                content,
                userId: user.userId,
                commentId  // 새로운 댓글을 상위 댓글에 연결하기 위해 commentId를 추가합니다
            });

            return { "Message": "댓글을 작성했습니다" }
        } catch (err) {
            throw err;
        } 
    }

    

}