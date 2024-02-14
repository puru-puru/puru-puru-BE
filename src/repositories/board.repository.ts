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

    // boardPatch = async (boardId: string, title: string, image: string, content: string, user: any) => {
    //     try {
    //         console.log("리포지토리 들어옴")
    //         const existingBoard = await Boards.findOne({ where : { id: boardId, userId: user.id }});
    //         console.log("existingBoard", existingBoard)

    //         if (!existingBoard) {
    //             throw new Error ("수정할 게시글을 찾을 수 없습니다.");
    //         }
    //         // 게시글 수정
    //         existingBoard.title = title;
    //         existingBoard.image = image;
    //         existingBoard.content = content;

    //         // await existingBoard.save(); // db저장 전 존재여부 확인
    //         if (existingBoard && existingBoard.changed()) {
    //             await existingBoard.save();
    //         }

    //         console.log("리포지토리 나갑니다.")

    //         return existingBoard;
    //     } catch (err) {
    //         console.error("Error during findOne:", err);
    //         throw err;
    //     }
    // }

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

            if (patchedBoard && patchedBoard.length > 0) {
            // 수정한 내용의 게시물이 있다면 patchedBoard[0] 를 반환홥니다.
            return patchedBoard[0].toJSON();
            }
            return null;
        } catch (err) {
            throw err;
        }

    }

}