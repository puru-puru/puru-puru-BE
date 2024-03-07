import { CreatedAt } from "sequelize-typescript";
import { Diaries } from "../../models/Diaries";
import { Templelates } from "../../models/Templelates";
import { SavedTemplelates } from "../../models/SavedTemplelates";
import { UserPlant } from "../../models/UserPlant";
import { Plants } from "../../models/plants";
import { Icons } from "../../models/Icons";
import sequelize from "../../models";
import { Transaction } from "sequelize";

interface tagData{
    [tag: string]: string;
}

export class MyplantsRepository {

    // 나의 식물일지를 등록하는 API이다.
    postMyPlant = async (name: string, plantAt: string, user: any, imageUrl: string) => {
        try {
            // 먼저 새로운 일지를 생성을 한다.
            // 프론트에서 받은 정보가 그대로 입력되며, deletedAt이 추가되어 
            // 현재 상태에서는 생성되는 동시에 삭제된 상태이다.
            // 삭제 상태는 나중에 연동하는 식물을 추가할 때 복구된다.
            const newDiary = await Diaries.create({
                name,
                plantAt,
                userId: user.userId,
                image: imageUrl,
                deletedAt: Date()
            });
            // TemplelatesDB에서 모든 질문들을 가져온다.
            const questions = await Templelates.findAll();

            function shuffelArray(array: any[]): any[] {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            // 그 모든 질문의 순서를 뒤죽박죽 바꾼다.
            const shuffledQuestions = shuffelArray(questions);
            // 그 다음, 앞에서 3개를 남기고 잘라낸다.
            const slicedQuestions = shuffledQuestions.slice(0, 3);
            // 생성된 식물 일지에 3개의 질문을 연계해서 함께 생성한다.
            // 각 질문에는 연계되는 답도 생기는데,
            // 기본적으로 '질문에 답하세요'라고 텍스트와 함께 생성된다.
            const generateQuestions = () => {
                slicedQuestions.map(async questions => {
                    await SavedTemplelates.create({
                        answer: " ",
                        diaryId: newDiary.diaryId,
                        templelateId: questions.templelateId,
                    });
                })
            }

            generateQuestions();

            return { "Message": "나의 반려 식물이 등록되었습니다" }

        } catch (err) {

            throw (err);
        }
    }

    // 나의 식물 일지와 연동하는 나의 식물 등록 메서드
    savePlants = async (user: any, plantsId: any) => {
        try {
            // 먼저 사용자가 작성한 모든 나의 식물 일지를,
            // 삭제 처리된 것도 포함해 모두 불러옵니다.
            const findDiaries = await Diaries.findAll({
                where: {
                    userId: user.userId
                },
                paranoid: false
            });

            console.log('찾은 식물일지는 다음이다',findDiaries);
            // 사용자가 작성한 모든 식물일지를 불러오면 
            // 그 중에 가장 최근에 작성한 식물일지를 찾아냅니다.
            const diaryId = findDiaries[findDiaries.length - 1].diaryId
            const restoreRecord = await Diaries.findOne({
                where: { diaryId: diaryId },paranoid: false
            });
            // 해당 최신 식물일지는 식물을 등록하지 않은 상태니 삭제처리가 되어있어,
            // 삭제 처리를 취소 및 복구시키는 메서드를 먼저 실행시킵니다.
            if (restoreRecord) {
                await restoreRecord.restore(); 
                console.log(`레코드가 성공적으로 복구되었습니다. 해당 다이어리 아이디: ${diaryId}`);
            }
            // 이후 해당 식물일지의 diaryId에 맞춰
            // 연동하는 식물을 등록합니다.
            await UserPlant.create({
                diaryId: diaryId,
                plantsId
            })

            return { "Message": "식물이 해당 일지에 저장되었습니다" }
        } catch (err) {
            throw err;
        }
    }

    // 본 메서드는 saveplants와 상당 부분 비슷하나,
    // db내 식물을 검색하여 해당 식물을 연동하는 방법이 아닌,
    // 직접 식물을 생성하여 나의 식물일지에 연동하는 방식입니다
    newPlants = async (user: any, plantName: string, type: string, content: string) => {
        try {
            // 새로운 식물을 생성하는 데이터를 사용자가 작성하면,
            // 이를 그대로 받아 plantsDB에 바로 생성을 합니다.
            // 다만, 테그에 #신규 식물이라는 단어가 붙어, 기존 식물과 차별화를 합니다.
            const newPlant = await Plants.create({
                plantName: plantName,
                type: type,
                image: 'https://purupuru-bk.s3.ap-northeast-2.amazonaws.com/test/1709031868072.png', // 중복된 이미지라도 이제 오류 발생 안 함
                content: content,
                tag: '#신규 식물'
            });

            // 이후 메서드는 비슷비슷합니다.
            const findDiaries = await Diaries.findAll({
                where: {
                    userId: user.userId
                },
                paranoid: false
            });

            const diaryId = findDiaries[findDiaries.length - 1].diaryId;

            const restoreRecord = await Diaries.findOne({
                where: { diaryId: diaryId },paranoid: false
            });
            if (restoreRecord) {
                await restoreRecord.restore(); 
                console.log(`레코드가 성공적으로 복구되었습니다. 해당 다이어리 아이디: ${diaryId}`);
            }

            await UserPlant.create({
                diaryId,
                plantsId: newPlant.plantsId
            });

            return { "Message": "신규 식물이 등록되었으며, 나의 식물에 포함되었습니다" };

        } catch (err) {
            console.error('Error in newPlants:', err);
            throw err;
        }
    }

    showMyPlants = async (user: any) => {
        try {     

            const MyPlants = await Diaries.findAll({
                where: {
                    deletedAt: null,
                    userId: user.userId
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt', 'id']
                },
                include: [{
                    model: UserPlant,
                    attributes: ['userplantId'],
                    include: [{
                        model: Plants,
                        attributes: ['plantName','type', 'content']
                    }]
                },
                {
                    model: SavedTemplelates,
                    attributes: ['id', 'answer'],
                    include: [{
                        model: Templelates,
                        attributes: ['question']
                    }],
                }],
            });

            return MyPlants;

        } catch (err) {
            throw err;
        }
    }
    

    answering = async (user: any, diaryId: any, templateId: any, answer: any) => { 
        try {
            await SavedTemplelates.update({ answer: answer },
                {
                    where: {
                        id: templateId
                    }
                });
    
            return { "Message": "답변이 등록되었습니다" }
        } catch (err) {
            throw err;
        }       
    }

    deletePlants = async (diaryId: any) => {
        try {
            await Diaries.update({ deletedAt: Date() }, {
                where: { diaryId }
            })

            return { "Message": "해당 일지를 삭제하였습니다" }
        } catch (err) {
            throw err;
        }
    }


    postImage = async (imageUrl: string) => {
        try {
            await Icons.create({
                image: imageUrl
            });

            return { "Message": "이미지가 등록되었습니다" }

        } catch (err) {

            throw (err);
        }
    }
}
