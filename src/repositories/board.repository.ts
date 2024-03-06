import { Boards } from "../../models/Boards";
import { Users } from "../../models/Users";
import { Comments } from "../../models/Comments";
import { Likes } from "../../models/likes";

export class BoardRepository {
    // 커뮤니티 게시글 작성하기
    boardPost = async (
        title: string,
        imageUrl: any,
        content: string,
        userId: any
    ) => {
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
    };

    // 게시물 상세보기 - 좋아요 개수 포함
    boardDetailWithLikeCount = async (boardId: any) => {
        try {
            const board = await Boards.findByPk(boardId, {
                include: [
                    {
                        model: Users,
                        attributes: ["nickname"],
                        as: "author",
                    },
                    {
                        model: Comments,
                        attributes: ["id", "content", "createdAt"],
                        include: [
                            {
                                model: Users,
                                attributes: ["nickname"],
                                as: "user",
                            },
                        ],
                    },
                ],
            });

            if (!board) {
                return null;
            }

            // 좋아요 개수 조회
            const likeCount = await this.getLikeCount(boardId);

            // 좋아요 개수를 데이터에 추가
            board.setDataValue("likeCount", likeCount);

            return board;
        } catch (err) {
            throw err;
        }
    };

    // 커뮤니티 게시글 수정하기
    boardPatch = async (
        boardId: any,
        title: string,
        imageUrl: any,
        content: string
    ) => {
        try {
            const board = await Boards.findOne({ where: { boardId } }); // 이 방식은
            // 파인드를 통해서 우선 보드 아이디의 값을 찾고 있는 경우

            if (!board) {
                // 얘를 뚫고 내려가서
                throw new Error("게시글을 찾을 수 없습니다.");
            }
            // 아래의 방법으로 직접 값을 넣어줌.
            board.title = title;
            board.image = imageUrl;
            board.content = content;

            // 위에서 넣어준 값을 시퀄라이즈는 아래 처럼 세이브 를 통해서 말그대로 저장 할 수 있음
            await board.save();

            return {
                // 이거는 이제 값을 넘겨준다.
                title: board.title,
                image: board.image,
                content: board.content,
            };
        } catch (err) {
            throw err;
        }
    };

    getBoardById = async (boardId: any) => {
        try {
            const board = await Boards.findOne({ where: { boardId } });

            return board;
        } catch (err) {
            throw err;
        }
    };

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
    };

    // 여기서 부터 하단 까지가 전체 메인페이지
    getLikeCount = async (boardId: any) => {
        try {
            const likeCount = await Likes.count({
                where: {
                    boardId,
                    deletedAt: null,
                },
            });

            return likeCount;
        } catch (err) {
            throw err;
        }
    };

    // 게시물 전체 조회 (메인 페이지)
    getBoardDataWithLikeCount = async (user: any) => {
        try {
            const boards = await Boards.findAll({
                where: {
                    deletedAt: null,
                },
                include: [
                    {
                        model: Users,
                        attributes: ["nickname"],
                        as: "author",
                    },
                    {
                        model: Likes,
                        attributes: [],
                        where: {
                            deletedAt: null,
                        },
                        required: false,
                    },
                    {
                        model: Comments,
                        attributes: [],
                        where: {
                            deletedAt: null,
                        },
                        required: false,
                    },
                ],
                attributes: [
                    "boardId",
                    "title",
                    "image",
                    "content",
                    "createdAt",
                ],
                order: [["createdAt", "DESC"]],
            });

            // 좋아요 및 댓글 개수를 조회하여 각 게시물 데이터에 추가
            const boardData = await Promise.all(
                boards.map(async (board) => {
                    const boardInfo: any = board.toJSON();

                    // 좋아요 개수 조회
                    const likeCount = await Likes.count({
                        where: {
                            boardId: boardInfo.boardId,
                            deletedAt: null,
                        },
                    });

                    // 댓글 개수 조회
                    const commentCount = await Comments.count({
                        where: {
                            boardId: boardInfo.boardId,
                            deletedAt: null,
                        },
                    });

                    // 좋아요 및 댓글 개수를 데이터에 추가
                    boardInfo.likeCount = likeCount;
                    boardInfo.commentCount = commentCount;

                    return boardInfo;
                })
            );

            return boardData;
        } catch (err) {
            throw err;
        }
    };

    // 인기순으로 게시글 목록 불러오기
    boardListLikee = async (user: any) => {
        try {
            const boards = await Boards.findAll({
                where: {
                    deletedAt: null,
                },
                include: [
                    {
                        model: Users,
                        attributes: ["nickname"],
                        as: "author",
                    },
                ],
                attributes: [
                    "boardId",
                    "title",
                    "image",
                    "content",
                    "createdAt",
                ],
                order: [["createdAt", "DESC"]],
            });

            // 좋아요 개수를 조회하여 각 게시물 데이터에 추가
            const boardData = await Promise.all(
                boards.map(async (board) => {
                    const boardInfo: any = board.toJSON();

                    // 좋아요 개수 조회
                    const likeCount = await this.getLikeCount(
                        boardInfo.boardId
                    );

                    // 좋아요 개수를 데이터에 추가
                    boardInfo.likeCount = likeCount;

                    return boardInfo;
                })
            );

            boardData.sort((a, b) => b.likeCount - a.likeCount); // 많은 순으로 정렬해준다 외워라

            return boardData;
        } catch (err) {
            throw err;
        }
    };

    /// 내가 작성한 글 목록 불러오기
    boardMyPostsList = async (user: any) => {
        try {
            // 내가 작성한 모든 게시물 가져오기
            const myPosts = await Boards.findAll({
                where: {
                    deletedAt: null,
                    userId: user.userId,
                },
                include: [
                    {
                        model: Users,
                        attributes: ["userId", "nickname"],
                        as: "author",
                    },
                    {
                        model: Likes,
                        attributes: [], // 좋아요 테이블에서 id만 필요
                        where: {
                            deletedAt: null,
                        },
                        required: false, // LEFT JOIN으로 설정
                    },
                    {
                        model: Comments,
                        attributes: [], // 댓글 테이블에서는 특정 컬럼을 필요로하지 않으므로 빈 배열을 사용
                        where: {
                            deletedAt: null,
                        },
                        required: false, // LEFT JOIN으로 설정
                    },
                ],
                attributes: [
                    "boardId",
                    "title",
                    "image",
                    "content",
                    "createdAt",
                ],
                order: [["createdAt", "DESC"]],
            });
            // 좋아요 개수 및 댓글 개수를 추가
            const myPostsData = myPosts.map(async (post) => {
                const postData: any = post.toJSON();

                return postData;
            });

            // 모든 게시물에 대한 좋아요 총 갯수 계산
            const totalLikesCount = await this.getTotalLikesCount(user.userId);

            // 모든 게시물에 대한 댓글 총 갯수 계산
            const totalCommentsCount = await this.getTotalCommentsCount(
                user.userId
            );

            // 좋아요 및 댓글 총 갯수를 리스폰스
            const responseData = {
                data: await Promise.all(myPostsData),
                loginUser: user.nickname,
                totalLikesCount,
                totalCommentsCount,
            };

            return responseData;
        } catch (err) {
            throw err;
        }
    };

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
                        attributes: ["userId", "nickname"],
                        as: "user",
                    },
                ],
                attributes: ["content", "createdAt"],
                order: [["createdAt", "DESC"]],
            });
            return myComments;
        } catch (err) {
            throw err;
        }
    };

    // 글 검색하기
    boardSearch = async (Keyword: string) => {
        try {
            const posts = await Boards.findAll();
            const searchPosts = posts.filter((write) => {
                return (
                    write.title.includes(Keyword) ||
                    write.content.includes(Keyword)
                );
            });
            return searchPosts;
        } catch (err) {
            throw err;
        }
    };

    // 전체 좋아요 수
    getTotalLikesCount = async (userId: number) => {
        try {
            const totalLikesCount = await Likes.count({
                where: {
                    userId,
                },
            });

            return totalLikesCount;
        } catch (err) {
            throw err;
        }
    };

    // 댓글 수
    getTotalCommentsCount = async (userId: number) => {
        try {
            const totalCommentsCount = await Comments.count({
                where: {
                    userId,
                },
            });

            return totalCommentsCount;
        } catch (err) {
            throw err;
        }
    };
}
