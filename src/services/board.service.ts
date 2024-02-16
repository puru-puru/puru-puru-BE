import { Request, Response, NextFunction } from 'express'
import { BoardRepository } from '../repositories/board.repository'
import { Boards } from '../../models/Boards'
import { Users } from '../../models/Users';
import { combineTableNames } from 'sequelize/types/utils';


export class BoardService {
    boardRepository = new BoardRepository();

    // 커뮤니티 전체 게시글 조회
    boardList = async () => {
        try {
            const boards = await Boards.findAll({
                where: {
                    deletedAt: null,
                },
                include: [
                    {
                        model: Users,
                        attributes: ['nickname'], // 가져올 사용자 모델의 속성을 지정합니다.
                    },
                ],
                attributes: ['title', 'content', 'createdAt'], 
            });
    
            return boards;
        } catch (err) {
            throw err;
        }
    };

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
            return await this.boardRepository.boardDetail(boardId);
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 수정하기
    boardPatch = async (boardId: string, title: string, image: string, content: string) => {
        try {
            const existingBoard = await this.boardRepository.getBoardById(boardId);
            if (existingBoard) { // 게시글이 존재하면 수정을 진행
                await this.boardRepository.boardPatch(boardId, title, image, content);
            }

            return existingBoard;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 삭제하기
    boardDelete = async (boardId: number) => {
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
