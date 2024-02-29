import { Request, Response, NextFunction } from 'express'
import { LikeService } from '../services/like.service'

export class LikeController {
    likeService = new LikeService();

    likePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { boardId } = req.params;
            const user: any = req.user;

            const result = await this.likeService.likePost(user.userId, boardId);

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

   // 게시물에 좋아요 취소
   removeLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { boardId } = req.params;
        const user: any = req.user;

        if (!user) {
            return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
        }

        await this.likeService.removeLike(user.userId, boardId);

        res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    } catch (err) {
        next(err);
    }
}
}