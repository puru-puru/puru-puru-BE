import { CreatedAt } from "sequelize-typescript";
import { Diaries } from "../../models/Diaries";
import { Templelates } from "../../models/Templelates";
import { SavedTemplelates } from "../../models/SavedTemplelates";
import { UserPlant } from "../../models/UserPlant";
import { Plants } from "../../models/plants";

export class MyplantsRepository {

    postMyPlant = async (name: string, plantAt: string, user: any, imageUrl: string) => {
        try {
            const newDiary = await Diaries.create({
                name,
                plantAt,
                id: user.id
            });

            const questions = await Templelates.findAll(); // 전부 가져옴. 미쳤네

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
                slicedQuestions.map(questions => {
                    SavedTemplelates.create({
                        answer: "질문에 답해주세요",
                        diaryId: newDiary.diaryId,
                        templelateId: questions.templelateId,
                    });
                })
            }

            generateQuestions();

            return { "Message": "나의 반려 식물이 등록되었습니다" }

        } catch (err) {
            throw err;
        }
    }

    showMyPlants = async (user: any) => {
        try {
            const MyPlants = await Diaries.findAll({
                where: {
                    deletedAt: null,
                    id: user.id
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt', 'id']
                },
                include: [{
                    model: UserPlant,
                    attributes: ['userplantId'],
                    include: [{
                        model: Plants,
                        attributes: ['type', 'content']
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

    savePlants = async (diaryId: any, plantsId: any) => {
        try {
            await UserPlant.create({
                diaryId,
                plantsId
            })

            return { "Message": "식물이 해당 일지에 저장되었습니다" }
        } catch (err) {
            throw err;
        }
    }

    deletePlants = async (diaryId: any) => {
        try {
            await Diaries.update({deletedAt: "deleted"}, {
                where: {diaryId}
            })

            return { "Message": "해당 일지를 삭제하였습니다" }
        } catch (err) {
            throw err;
        }
    }

    newPlants = async (diaryId: any, plantName: string, type: string, content: string) => {
        try {
            const newPlant = await Plants.create({
                plantName: plantName,
                type: type,
                image: '아직 지정 안됨',
                content: content,
                tag: '#신규 식물'
            })
            await UserPlant.create({
                diaryId,
                plantsId: newPlant.plantsId
            }) 

            return { "Message": "신규 식물이 등록되었으며, 나의 식물에 포함되었습니다" }
        } catch (err) {
            throw err;
        }
    }
}