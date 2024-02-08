// import { User } from '../types/customtype/express'
import { BoardService } from '../services/board.service'
import { Request, Response, NextFunction } from 'express'
import { Boards } from '../../models/Boards'
import { where } from 'sequelize';
// import Joi from 'joi' <-- 정확한 형식이 생기면 활용.
// import upload from '../../~~~' <-- 이미지 업로드

export class BoardController {
    boardService = new BoardService();

    // 커뮤니티 게시글 전체 조회
    boardList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("컨트롤러 드러옹ㅁ")
            const boards = await this.boardService.boardList(); // 여기서 요청을 넘겨줌
            console.log("컨트롤러 나감")
            return res.status(200).json({ data: boards }) // 다시 뿌려주기 여기로.
        } catch (err) {
            next(err)
        }
    }

    boardPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("들어옴")
            const { title, image, content } = req.body
            const user: any = req.user;

            const boardPost = await this.boardService.boardPost(
                title,
                image,
                content,
                user
            )
            console.log("나가는곳")
            return res.status(200).json({ message: " 등록 완료 ", data: boardPost })
        } catch (err) {
            next(err)
        }
    }

}

// router.get('/boards', boardController.boardList)

// router.post('/boards', boardController.boardPost)

// router.get('/boards/:boardId', boardController.boardDetail)

// router.patch('/boards/:boardId', boardController.boardPetch)

// router.delete('/boards/:boardId', boardController.boardDelete)