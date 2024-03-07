import { NextFunction, Request, Response } from "express";
import { ValidationError } from 'joi';

// 조이 밸리데이션 에러.. 처리 하는 부분.
function joiValidationError(err: ValidationError, res: Response) {
    if (err.details && err.details.length > 0) { // 를 통해서 배열이 존재 하고 비어 있지 않은 경우를 확인.
        const JoiError = err.details[0];// 배열의 첫번째 오류를 뽑아옴.
        switch (JoiError.type) { // 조이에러의 타입에 따라서 다른 처리 진행.
            case 'string.email': // 과 같은 오류 라면 하단 출력.
                return res.status(409).json({ errorMessage: "이메일 형식에 맞지 않습니다." });
            case 'any.only': // 과 같으면서.
                const fieldName = JoiError.path?.[0]; 
                if (fieldName === 'confirmPassword') { // 필드 이름이 이것과 같다면 아래 출력 !
                    return res.status(400).json({ errorMessage: "두 비밀번호가 일치하지 않습니다." });
                }
                break;
        }
    }
}
// 에러 핸들링 미들웨어 기존 방식.
export default function (err: any, req: Request, res: Response, next: NextFunction) {
    try {
        switch (true) {
            case err instanceof ValidationError:
                return joiValidationError(err, res);

            case err.name === "ValidationError":
                return res.status(400).json({ errorMessage: " 데이터 형식이 올바르지 않습니다. " })

            case err.name === "ExistUser":
                return res.status(409).json({ errorMessage: "이미 사용 중인 이메일입니다." });

            case err.name === "WorngPassword":
                return res.status(409).json({ errorMessage: "비밀번호가 일치하지 않습니다." });

            case err.name === "UserNotFound":
                return res.status(401).json({ errorMessage: "사용자를 찾을 수 없습니다." });

            case err.name === "BoardNotFound":
                return res.status(400).json({ errorMessage: "게시물 찾을 수 없음" });

            case err.name === "Nopic":
                return res.status(404).json({ errorMessage: "등록된 사진이 존재하지 않습니다." });

            case err.name === "FailUpload":
                return res.status(400).json({ errorMessage: "이미지 업로드에 실패했습니다." });

            case err.name === "GalleryNotFound":
                return res.status(404).json({ errorMessage: "이미지를 찾을 수 없습니다." });

            case err.name === "NotAllowedName":
                return res.status(400).json({ errorMessage: "닉네임은 한글, 영어, 숫자로만 입력해주세요." });

            case err.name === "UnFitFrom":
                return res.status(400).json({ errorMessage: "이메일 형식에 맞지 않습니다." });
            
            case err.name === "ExistName":
                return res.status(409).json({ errorMessage: " 중복된 닉네임 입니다. " })

            default:
                console.error('-----------에러----------:', err);
                return res.status(500).json({ errorMessage: "예기치 모른 에러 발생.." });
        }
    } catch (err) {
        res.status(500).json({ errorMessage: "서버 내부 에러가 발생했습니다." });
    }
}
