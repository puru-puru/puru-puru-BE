import { Boards } from "../../models/Boards";
import { Users } from "../../models/Users";
import { Comments } from "../../models/Comments";

export class BoardRepository {

 // 커뮤니티 게시글 전체 조회 및 메인 페이지
 boardList = async (user: any) => {
    try {
        const boards = await Boards.findAll({
            where: {
                deletedAt: null
            },
            include: [
                {
                    model: Users,
                    attributes: ['nickname'],
                    as: 'author'
                },
            ],
            attributes: ['boardId', 'title', 'image', 'content', 'createdAt'],
        });
        // 로그인 한 사용자의 정보를 가져옴. 
        const boardData = boards.map(board => {
            const boardInfo: any = board
            return boardInfo;
        });

        return boardData;
    } catch (err) {
        throw err;
    }
}

    // 커뮤니티 게시글 작성하기
    boardPost = async (title: string, imageUrl: any, content: string, userId: any) => {
        try {
            const boardPost = await Boards.create({
                title,
                image: imageUrl,
                content,
                userId,  
            });
            return boardPost;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 상세보기
    boardDetail = async (boardId: any) => {
        try {
            const board = await Boards.findByPk(boardId, {
                include: [
                    {
                        model: Users,
                        attributes: [ 'nickname' ],
                        as: 'author'
                    },
                    {
                        model: Comments,
                        attributes: [ 'id', 'content', 'createdAt' ],
                        include: [
                            {
                                model: Users,
                                attributes: [ 'nickname' ],
                                as: 'user'
                            }
                        ]
                    },
                ]
            });
            if (!board) {
                return null;
            }

            return board
        } catch (err) {
            throw err;
        }
    }

    

    // 커뮤니티 게시글 수정하기
    boardPatch = async (boardId: any, title: string, image: string, content: string) => {
        try {
            await Boards.update(
                { title, image, content },
                { where: { boardId } }
            );
            const fixedBoard = await Boards.findOne({where: {boardId}})
            
            return fixedBoard;
        } catch (err) {
            throw err;
        }
    }

    getBoardById = async (boardId: any) => {
        try {
            const board = await Boards.findOne({ where: { boardId } });

            return board;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 삭제하기
    boardDelete = async (boardId: any) => {
        try {
            const deletedCount = await Boards.destroy({
                where: { boardId },
            });

            return deletedCount;
        } catch (err) {
            throw err;
        }
    }



    // 커뮤니티 게시글 삭제하기


}