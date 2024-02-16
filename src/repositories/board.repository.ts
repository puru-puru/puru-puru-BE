import { Boards } from "../../models/Boards";

export class BoardRepository {

    // 커뮤니티 게시글 전체 조회
    boardList = async () => {
        try {
            const boards = await Boards.findAll({
                where: {
                    deletedAt: null
                }
            })
            return boards
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 작성하기
    boardPost = async (title: string, imageUrl: any, content: string, user: any) => {
        try {
            const boardPost = await Boards.create({
                title,
                image: imageUrl,
                content,
                user
            })
            return boardPost
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 상세보기
    boardDetail = async (boardId: string) => {
        try {
            const board = await Boards.findByPk(boardId);

            // 게시글이 없을 경우 null을 반환
            return board ? board.toJSON() : null;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 수정하기
    boardPatch = async (boardId: string, title: string, image: string, content: string) => {
        try {
            const [updatedRowsCount, patchedBoard] = await Boards.update(
                { title, image, content },
                { where: { id: boardId }, returning: true }
            );

            // 수정된 내용이 없다면 null을 반환하게끔
            if (updatedRowsCount === 0) {
                return null;
            }

            // 수정한 내용의 게시물이 있다면 patchedBoard[0] 를 반환홥니다.
            return patchedBoard[0];
        } catch (err) {
            throw err;
        }
    }

    getBoardById = async (boardId: string) => {
        try {
            const board = await Boards.findOne({ where: { id: boardId } });
            // console.log( {message : "id값 : " , boardId} );

            return board;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 삭제하기
    boardDelete = async (boardId: number) => {
        try {
            const deletedCount = await Boards.destroy({
                where: { id: boardId },
            });

            return deletedCount;
        } catch (err) {
            throw err;
        }
    }



    // 커뮤니티 게시글 삭제하기


}