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

    boardPost = async ( title: string, image: string, content: string, user: any ) => {
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
}