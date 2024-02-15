import { Request, Response, NextFunction } from 'express'
import { BoardRepository } from '../repositories/board.repository'
import { Boards } from '../../models/Boards'
import { combineTableNames } from 'sequelize/types/utils';


export class BoardService {
    boardRepository = new BoardRepository();

    // 커뮤니티 전체 게시글 조회
    boardList = async () => {
        try {
            console.log("서비스 드러와/ㅅ다 낙ㅁ")
            return await this.boardRepository.boardList() // 또 넘기겠죠 레포에
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 작성하기
    boardPost = async (title: string, image: string, content: string, user: any) => {
        try {
            console.log("서비스 부분 들어옴")
            const boardPost = await this.boardRepository.boardPost(
                title,
                image,
                content,
                user
            )
            console.log("서비스 부분 나감")
            return {
                title: boardPost.title,
                image: boardPost.image,
                content: boardPost.content,
                user
            }
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 상세보기
    boardDetail = async (boardId: string) => {
        try {
            console.log("서비스 들어옴");
            return await this.boardRepository.boardDetail(boardId);
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 수정하기
    boardPatch = async (boardId: string, title: string, image: string, content: string) => {
        try {
            console.log("서비스 부분 들어옴");
            const existingBoard = await this.boardRepository.getBoardById(boardId);
            if (existingBoard){ // 게시글이 존재하면 수정을 진행
                await this.boardRepository.boardPatch(boardId, title, image, content);    
            }
            
            console.log("서비스 부분 나감");

            return existingBoard;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 삭제하기


}
