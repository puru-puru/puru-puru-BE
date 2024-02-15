import { Boards } from "../../models/Boards";

export class BoardRepository {

    // 커뮤니티 게시글 전체 조회
    boardList = async () => {
        try {
            console.log("레포 들어왔다 ")
            const boards = await Boards.findAll({
                where: {
                    deletedAt: null
                }
            })
            console.log("나감 레포")
            return boards
        } catch (err) {
            console.error("레포 에러", err)
            throw err;
        }
    }

    // 커뮤니티 게시글 작성하기
    boardPost = async (title: string, image: string, content: string, user: any) => {
        try {
            console.log("레포 들옹ㅁ")
            const boardPost = await Boards.create({
                title,
                image,
                content,
                user
            })
            console.log("나감 레포")
            return boardPost
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 상세보기
    boardDetail = async (boardId: string) => {
        try {
            console.log("리포지토리 들어옴");
            const board = await Boards.findByPk(boardId);

            console.log("리포지토리 나감")
            // 게시글이 없을 경우 null을 반환
            return board ? board.toJSON() : null;
        } catch (err) {
            throw err;
        }
    }

    // 커뮤니티 게시글 수정하기
    boardPatch = async (boardId: string, title: string, image: string, content: string) => {
        try {
            console.log("리포지토리 들어옴");
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
            console.log("게시글 확인 리포지토리 부분 들어옴");
            const board = await Boards.findOne({ where: { id: boardId } });
            // console.log( {message : "id값 : " , boardId} );
            console.log("게시글 확인 리포지토리 부분 나감");

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