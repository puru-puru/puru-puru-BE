import { NextFunction, Request, Response } from "express"

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
    try {
        if(err.name === "ValidationError") {
            return res.status(400).json({ errorMessage: " 데이터 형식이 올바르지 않습니다. " })
        } else if(err.name === "ExistUser") {
            return res.status(409).json({ errorMessage: " 이미 사용중인 이메일 입니다. " })
        } else if(err.name === "WorngPassword") {
            return res.status(409).json({ errorMessage: " 비밀번호가 일치 하지 않습니다. " })
        } else if(err.name === "UserNotFound") {
            return res.status(400).json({ errorMessage: " 사용자를 찾을 수 없습니다. " })
        }
            next(err)
    } catch (err) {
        res.status(500).json({ errorMessage: " 서버 내부 에러가 발생 했습니다. " })
    }
}