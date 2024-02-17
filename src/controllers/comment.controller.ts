// import { User } from '../types/customtype/express'
import { CommentService } from '../services/comment.service'
import { Request, Response, NextFunction } from 'express'
import { Comments } from '../../models/Comments'
import { where } from 'sequelize';
// import Joi from 'joi' <-- 정확한 형식이 생기면 활용.
// import upload from '../../~~~' <-- 이미지 업로드

export class CommentController {
    commentService = new CommentService();

    postComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {content} =req.body;
            const {boardId} =req.params
            const user: any = req.user;
            const comment = await this.commentService.postComment(
                content, boardId, user
            ); 
            return res.status(200).json(comment) 
        } catch (err) {

            next(err)
        }
    }

    updateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {content} =req.body;
            const {commentId, boardId} =req.params
            const user: any = req.user;
            const comment = await this.commentService.updateComment(
                content, commentId, boardId, user
            ); 
            return res.status(200).json(comment) 
        } catch (err) {

            next(err)
        }
    }

    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {content} =req.body;
            const {commentId, boardId} =req.params
            const user: any = req.user;
            const comment = await this.commentService.deleteComment(
                content, commentId, boardId, user
            ); 
            return res.status(200).json(comment) 
        } catch (err) {

            next(err)
        }
    }


}

