import { Boards } from "../../models/Boards";
import { Users } from "../../models/Users";
import { Comments } from "../../models/Comments";
import { Likes } from "../../models/likes";
// import sequelize from "./index";

export class BoardRepository {

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

    // 게시물 상세보기 - 좋아요 개수 포함
    boardDetailWithLikeCount = async (boardId: any) => {
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

            // 좋아요 개수 조회
            const likeCount = await this.getLikeCount(boardId);

            // 좋아요 개수를 데이터에 추가
            board.setDataValue('likeCount', likeCount);

            return board;
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
            await board.save(); // 여기서 쓰이는구나 

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


    // 테스트 ------------------------------------------------------------------------------------------
    // 여기서 부터 하단 까지가 전체 메인페이지 
    getLikeCount = async (boardId: any) => {
        try {
            const likeCount = await Likes.count({
                where: {
                    boardId,
                    deletedAt: null
                }
            });

            return likeCount;
        } catch (err) {
            throw err;
        }
    }

    // 게시물 전체 조회 (메인 페이지)
    getBoardDataWithLikeCount = async (user: any) => {
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
                order: [['createdAt', 'DESC']],
            });

            // 좋아요 개수를 조회하여 각 게시물 데이터에 추가
            const boardData = await Promise.all(boards.map(async (board) => {
                const boardInfo: any = board.toJSON();

                // 좋아요 개수 조회
                const likeCount = await this.getLikeCount(boardInfo.boardId);

                // 좋아요 개수를 데이터에 추가
                boardInfo.likeCount = likeCount;

                return boardInfo;
            }));

            return boardData;
        } catch (err) {
            throw err;
        }
    }


    // 인기순으로 게시글 목록 불러오기
    boardListLikee = async (user: any) => {
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
                order: [['createdAt', 'DESC']],
            });

            // 좋아요 개수를 조회하여 각 게시물 데이터에 추가
            const boardData = await Promise.all(boards.map(async (board) => {
                const boardInfo: any = board.toJSON();

                // 좋아요 개수 조회
                const likeCount = await this.getLikeCount(boardInfo.boardId);

                // 좋아요 개수를 데이터에 추가
                boardInfo.likeCount = likeCount;

                return boardInfo;
            }));

            boardData.sort((a, b) => b.likeCount - a.likeCount) // 많은 순으로 정렬해준다 외워라

            return boardData;
        } catch (err) {
            throw err;
        }
    }

    // 내가 작성한 글 목록 불러오기
    boardMyPostsList = async (user: any) => {
        try {
            const myPosts = await Boards.findAll({
                where: {
                    deletedAt: null,
                    userId: user.userId, // 현재 로그인 한 사용자 ID를 기반으로 찾습니다.
                },
                include: [
                    {
                        model: Users,
                        attributes: ['userId', 'nickname'],
                        as: 'author'
                    },
                ],
                attributes: ['boardId', 'title', 'image', 'content', 'createdAt'],
                order: [['createdAt', 'DESC']],

            });
            return myPosts;
        } catch (err) {
            throw err;
        }
    }

    // 내가 작성한 댓글 목록 불러오기
    boardMyCommentsList = async (user: any) => {
        try {
            const myComments = await Comments.findAll({
                where: {
                    deletedAt: null,
                    userId: user.userId, // 현재 로그인 한 사용자 ID를 기반으로 찾습니다. 테스트코드
                },
                include: [
                    {
                        model: Users,
                        attributes: ['userId', 'nickname'],
                        as: 'user'
                    },
                ],
                attributes: ['content', 'createdAt'],
                order: [['createdAt', 'DESC']],

            });
            return myComments;
        } catch (err) {
            throw err;
        }
    }

}


