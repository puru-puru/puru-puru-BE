import { NextFunction, Request, Response } from "express";

export default function (err: any, req: Request, res: Response, next: NextFunction) {
    try {
        if (err.name === "ValidationError") {
            if (err.details[0].type === "any.only") {
                return res.status(400).json({ errorMessage: "두 비밀번호가 일치하지 않습니다." });
            } else {
                return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
            }
        } else if (err.name === "ExistUser") {
            return res.status(409).json({ errorMessage: "이미 사용 중인 이메일입니다." });
        } else if (err.name === "WorngPassword") {
            return res.status(409).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
        } else if (err.name === "UserNotFound") {
            return res.status(400).json({ errorMessage: "사용자를 찾을 수 없습니다." });
        } else if (err.name === "BoardNotFound") {
            return res.status(400).json({ errorMessage: "게시물 찾을 수 없음" })
        } else if (err.name === "Nopic") {
            return res.status(404).json({ errorMessage: " 등록된 사진이 존재 하지 않습니다. " })
        } else if (err.name === "FailUpload") {
            return res.status(400).json({ errorMessage: " 이미지 업로드에 실패 했습니다. " })
        } else if (err.name === "GalleryNotFound") {
            return res.status(404).json({ errorMessage: " 이미지를 찾을 수 없습니다. " })
        } else if (err.name === "NotAllowedName") {
            return res.status(400).json({ errorMessage: " 닉네임은 한글,영어,숫자로만 입력해주세요 " })
        } else if (err.name === "ExistName") {
            return res.status(409).json({ errorMessage: " 이미 존재 하는 닉네임 입니다. " })
        }
        next(err);
    } catch (err) {
        res.status(500).json({ errorMessage: "서버 내부 에러가 발생했습니다." });
    }
}
