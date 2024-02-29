import { Request, Response, NextFunction } from 'express'
import { BoardService } from '../services/board.service'
import { UserService } from '../services/user.service';
import { LikeController } from './like.controller';
import { Boards } from '../../models/Boards'
import { where } from 'sequelize';
import Joi from 'joi';

export class BoardController {
    boardService = new BoardService();
    userService = new UserService()
    likeController = new LikeController();

    // 유효성 검사
    readonly checkcontent = Joi.object({
        title: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎ가-힣!@#$%^&*()_+\\-=\\[\\]{};':\",./<>?|\\\\ \n\r]{2,20}$")).required(),
        content: Joi.string().pattern(new RegExp("^[a-zA-Z0-9ㄱ-ㅎ가-힣!@#$%^&*()_+\\-=\\[\\]{};':\",./<>?|\\\\ \n\r]{2,100}$")).required(),
    })

    // 커뮤니티 게시글 전체 조회
    boardList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: any = req.user;

            const boards = await this.boardService.boardListWithLikeCount(user);

            return res.status(200).json({ data: boards, loginUser: user.nickname });
        } catch (err) {
            next(err);
        }
    }


    
    // 커뮤니티 게시글 작성
    boardPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, content } = req.body;

            console.log("Title:", title);
            console.log("Content:", content);
            console.log("Content before validation:", req.body.content);

            // 유효성 검사
            const validationResult = this.checkcontent.validate({ title, content });
        if (validationResult.error) {
    console.error(validationResult.error);
    return res.status(400).json({ errormessage: "최소 2자 이상 입력하셔야 합니다." })
}
            const imageUrl = (req.file as any)?.location;
            const user: any = req.user;

            const boardPost = await this.boardService.boardPost(
                title,
                imageUrl,
                content,
                user.userId,
            );
            return res.status(200).json({ message: " 등록 완료 ", data: boardPost });
        } catch (err) {
            next(err);
        }
    }

    // 커뮤니티 게시글 상세보기
    boardDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { boardId } = req.params;
            const board = await this.boardService.boardDetailWithLikeCount(boardId);

            if (!board) {
                return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
            }

            return res.status(200).json({ data: { board } });
        } catch (err) {
            next(err);
        }
    }

    // 커뮤니티 게시글 수정하기
    boardPatch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { boardId } = req.params;
            const { title, content } = req.body;

            // 유효성 검사
            const validationResult = this.checkcontent.validate({ title, content });
            if (validationResult.error) {
                return res.status(400).json({ errormessage: "최소 2자 이상 입력하셔야 합니다." })
            }

            const imageUrl = (req.file as any)?.location;

            const patchedBoard = await this.boardService.boardPatch(boardId, title, imageUrl, content);

            return res.status(200).json({ message: '게시글이 수정되었습니다.', data: patchedBoard });
        } catch (err) {
            next(err);
        }
    }

    // 커뮤니티 게시글 삭제하기
    boardDelete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { boardId } = req.params

            const result = await this.boardService.boardDelete(boardId);

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}
