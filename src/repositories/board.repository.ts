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
                        attributes: ['nickname'],
                        as: 'author'
                    },
                    {
                        model: Comments,
                        attributes: ['id', 'content', 'createdAt'],
                        include: [
                            {
                                model: Users,
                                attributes: ['nickname'],
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
    boardPatch = async (boardId: any, title: string, imageUrl: any, content: string) => {
        try {
            const board = await Boards.findOne({ where: { boardId } }); // 이 방식은 
            // 파인드를 통해서 우선 보드 아이디의 값을 찾고 있는 경우

            if (!board) { // 얘를 뚫고 내려가서
                throw new Error('게시글을 찾을 수 없습니다.');
            }
            // 아래의 방법으로 직접 값을 넣어줌.
            board.title = title;
            board.image = imageUrl;
            board.content = content;
            
            // 위에서 넣어준 값을 시퀄라이즈는 아래 처럼 세이브 를 통해서 말그대로 저장 할 수 있음
            await board.save(); // 여기서 쓰이는구나 ㅆㅂ

            return {// 이거는 이제 값을 넘겨준다. 
                title: board.title,
                image: board.image,
                content: board.content
            };
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

}