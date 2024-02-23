import { Request, Response, NextFunction } from 'express'
import { BoardRepository } from '../repositories/board.repository'
import { CommentService } from './comment.service';
import { Boards } from '../../models/Boards'
import { Users } from '../../models/Users';
import { combineTableNames } from 'sequelize/types/utils';


export class BoardService {
    boardRepository = new BoardRepository();
    

    // 커뮤니티 전체 게시글 조회
    boardList = async (user: any) => {
        try {
            const boards = await this.boardRepository.boardList(user);
            return boards;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 작성하기
    boardPost = async (title: string, imageUrl: any, content: string, user: any) => {
        try {
            
            const boardPost = await this.boardRepository.boardPost(
                title,
                imageUrl,
                content,
                user
            )
            return boardPost
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 상세보기
    boardDetail = async (boardId: string) => {
        try {
            const board = await this.boardRepository.boardDetail(boardId);
            return board;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 수정하기
    boardPatch = async (boardId: any, title: string, imageUrl: any, content: string) => {
        try {
            const patchedBoard = await this.boardRepository.boardPatch(boardId, title, imageUrl, content);
            return patchedBoard;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 삭제하기
    boardDelete = async (boardId: any) => {
        try {
            const deletedCount = await this.boardRepository.boardDelete(boardId);

            if (deletedCount > 0) { 
                return { message: '게시글을 삭제했습니다.' };
            } else {
                return { message: '삭제할 게시글이 없습니다.' };
            }
        } catch (err) {
            throw err;
        }
    }

}
