import { CreatedAt } from "sequelize-typescript";
import { Diaries } from "../../models/Diaries";
import { Templelates } from "../../models/Templelates";
import { SavedTemplelates } from "../../models/SavedTemplelates";
import { UserPlant } from "../../models/UserPlant";
import { Plants } from "../../models/plants";
import { Icons } from "../../models/Icons";
import sequelize from "../../models";
import { Transaction } from "sequelize";

export class MyplantsRepository {

    postMyPlant = async (name: string, plantAt: string, user: any, imageUrl: string) => {
        try {
            const newDiary = await Diaries.create({
                name,
                plantAt,
                userId: user.userId,
                image: imageUrl,
                deletedAt: Date()
            });

            const questions = await Templelates.findAll();

            function shuffelArray(array: any[]): any[] {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            const shuffledQuestions = shuffelArray(questions);
            const slicedQuestions = shuffledQuestions.slice(0, 3);

            const generateQuestions = () => {
                slicedQuestions.map(async questions => {
                    await SavedTemplelates.create({
                        answer: "질문에 답해주세요",
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


    savePlants = async (user: any, plantsId: any) => {
        try {

            const findDiaries = await Diaries.findAll({
                where: {
                    userId: user.userId
                },
                paranoid: false
            });

            console.log('찾은 식물일지는 다음이다',findDiaries);

            const diaryId = findDiaries[findDiaries.length - 1].diaryId
            const restoreRecord = await Diaries.findOne({
                where: { diaryId: diaryId },paranoid: false
            });
            if (restoreRecord) {
                await restoreRecord.restore(); 
                console.log(`레코드가 성공적으로 복구되었습니다. 해당 다이어리 아이디: ${diaryId}`);
            }

            await UserPlant.create({
                diaryId: diaryId,
                plantsId
            })

            return { "Message": "식물이 해당 일지에 저장되었습니다" }
        } catch (err) {
            throw err;
        }
    }


    newPlants = async (user: any, plantName: string, type: string, content: string) => {
        try {
            const newPlant = await Plants.create({
                plantName: plantName,
                type: type,
                image: 'https://purupuru-bk.s3.ap-northeast-2.amazonaws.com/test/1709031868072.png', // 중복된 이미지라도 이제 오류 발생 안 함
                content: content,
                tag: '#신규 식물'
            });


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