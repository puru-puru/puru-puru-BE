import { Request, Response, NextFunction } from 'express'
import { CommentRepository } from '../repositories/comment.repository'
import { Comments } from '../../models/Comments'
import { combineTableNames } from 'sequelize/types/utils';


export class CommentService {
    commentRepository = new CommentRepository();

    // 커뮤니티 게시글 댓글 목록
    commentList = async () => {
        try {

        } catch (err){
            throw err;
        }
    }

    // 커뮤니티 게시글 댓글 작성
    commentPost = async (content: string, user: any) => {
        try {
            console.log("서비스 진입 (커뮤댓글작성");
            const commentPost = await this.commentRepository.commentPost(
                content,
                user
            )
            console.log(commentPost);
            console.log("서비스 퇴장 (커뮤댓글작성)");
            return {
                content: commentPost.content,
                user
            }
        } catch (err){
            throw err;
        }
    }

    // 커뮤니티 게시글 댓글 수정
    commentPatch = async () => {
        try {

        } catch (err){
            throw err;
        }
    }

    // 커뮤니티 게시글 댓글 삭제
    commentDelete = async () => {
        try {

        } catch (err){
            throw err;
        }
    }
}