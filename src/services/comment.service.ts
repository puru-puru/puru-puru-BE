import { Request, Response, NextFunction } from 'express'
import { CommentRepository } from '../repositories/comment.repository'
import { Boards } from '../../models/Boards'
import { combineTableNames } from 'sequelize/types/utils';


export class CommentService {
    commentRepository = new CommentRepository();


    postComment = async (content: string, boardId: any, user: any) => {
        try {
            return await this.commentRepository.postComment(
                content, boardId, user
            )
        } catch (err) {

            throw err;
        }
    }


    updateComment = async (content: string, commentId: any, boardId: any, user: any) => {
        try {
            return await this.commentRepository.updateComment(
                content, commentId, boardId, user
            )
        } catch (err) {

            throw err;
        }
    }


    deleteComment = async (content: string, commentId: any, boardId: any, user: any) => {
        try {
            return await this.commentRepository.deleteComment(
                content, commentId, boardId, user
            )
        } catch (err) {

            throw err;
        }
    }

    postComment2 = async (content: string, boardId: any, user: any, commentId: any) => {
        try {
            return await this.commentRepository.postComment2(
                content, boardId, user, commentId
            );
        } catch (err) {
            throw err;
        }
    }

    

}