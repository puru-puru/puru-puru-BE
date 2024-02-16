import { CommentService } from '../services/comment.service'
import { Request, Response, NextFunction } from 'express'
import { Boards } from '../../models/Boards'
import { where } from 'sequelize';
// import Joi from 'joi' <-- 정확한 형식이 생기면 활용.
// import upload from '../../~~~' <-- 이미지 업로드

export class CommentController {
    commentService = new CommentService();

    // 커뮤니티 게시글의 댓글 목록 조회
    commentList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("컨트롤러 진입 (커뮤댓글목록조회)")
            const comments = await this.commentService.commentList();
            console.log("컨트롤러 퇴장 (커뮤댓글목록조회)")
            return res.status(200).json({ data: comments })
        } catch (err){
            next(err)
        }
    }

    // 커뮤니티 게시글의 댓글 작성하기
    commentPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("컨트롤러 진입 (커뮤댓글작성)")
            const { content } = req.body
            const user: any = req.user;

            const commentPost = await this.commentService.commentPost(
                content,
                user
            )
            console.log("컨트롤러 퇴장 (커뮤댓글작성)")
            return res.status(200).json({ message: " 등록 완료 ", data: commentPost })
        } catch (err){
            next(err)
        }
    }

    // 커뮤니티 게시글의 댓글 수정하기
    commentPatch = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (err){
            next(err)
        }
    }

    // 커뮤니티 게시글의 댓글 삭제하기
    commentDelete = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (err){
            next(err)
        }
    }


}
