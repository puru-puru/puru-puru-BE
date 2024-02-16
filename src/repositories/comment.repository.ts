import { Comments } from "../../models/Comments";

export class CommentRepository {

    // 커뮤니티 게시글의 댓글 목록 조회
    commentList = async (commentId: string) => {
        try {
            console.log("리포지토리 진입 (커뮤댓글목록)")
            const comments = await Comments.findAll({
                where: {
                    commentId: commentId,
                    deletedAt: null
                }
            })
            console.log("리포지토리 퇴장 (커뮤댓글목록)")
            return comments
        } catch (err) {
            console.error("리포지토리 에러", err)
            throw err;
        }
    }

    // 커뮤니티 게시글의 댓글 작성하기
    commentPost = async (content: string, user: any) => {
        try {
            console.log("리포지토리 진입 (커뮤댓글작성)")
            const commentPost = await Comments.create({
                content,
                user
            })
            console.log("리포지토리 퇴장 (커뮤댓글목록)")
            return commentPost
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글의 댓글 수정하기
    commentPatch = async () => {
        try {

        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글의 댓글 삭제하기
    commentDelete = async () => {
        try {

        } catch (err) {
            throw err;
        }
    }

}