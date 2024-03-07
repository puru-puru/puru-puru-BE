import { Request, Response, NextFunction } from 'express'
import { BoardRepository } from '../repositories/board.repository'
import { CommentService } from './comment.service';
import { Boards } from '../../models/Boards'
import { Users } from '../../models/Users';
import { combineTableNames } from 'sequelize/types/utils';


export class BoardService {
    boardRepository = new BoardRepository();

    // 커뮤니티 게시글 작성하기
    boardPost = async (title: string, imageUrl: any, content: string, user: any) => {
        try {
            // 리포지토리의 boardPost 메소드를 호출해서 게시글 쓰고 결과를 반환한다~
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

    // 게시물 상세 보기 (에 더 나아가 좋아요개수까지 곁들인)
    boardDetailWithLikeCount = async (boardId: any) => {
        try {
            return await this.boardRepository.boardDetailWithLikeCount(boardId);
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

    // 최신순으로 목록을 정렬, (에 더 나아가 로그인 한 사용자의 정보, 좋아요개수를 가져옴)
    boardListWithLikeCount = async (user: any) => {
        try {
            return await this.boardRepository.getBoardDataWithLikeCount(user);
        } catch (err) {
            throw err;
        }

    }

    // 인기순으로 목록을 정렬
    boardListPopular = async (user: any) => {
        try {
            return await this.boardRepository.boardListLikee(user);
        } catch (err) {
            throw err;
        }
    }

    // 내가 작성한 글을 불러오기
    boardMyPostsList = async (user: any) => {
        try {
            return await this.boardRepository.boardMyPostsList(user);

        } catch (err) {
            throw err;
        }
    }

    // 내가 작성한 댓글 불러오기
    boardMyCommentsList = async (user: any) => {
        try {
            return await this.boardRepository.boardMyCommentsList(user);

        } catch (err) {
            throw err;
        }
    }

    // 글 검색하기
    boardSearch = async (keyword: string) => {
        try {
            const posts = await this.boardRepository.boardSearch(keyword);
            return posts;
        } catch (err) {
            throw err;
        }
    }

}
