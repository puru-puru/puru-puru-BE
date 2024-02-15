import { CreatedAt } from "sequelize-typescript";
import { Diaries } from "../../models/Diaries";
import { Templelates } from "../../models/Templelates";
import { SavedTemplelates } from "../../models/SavedTemplelates";
import { UserPlant } from "../../models/UserPlant";
import { Plants } from "../../models/plants";

export class MyplantsRepository {

    postMyPlant = async (image: string, name: string, plantAt: Date, user: any) => {
        try {
            const newDiary = await Diaries.create({
                image,
                name,
                plantAt,
                id: user.id
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
                        attributes: ['plantName', 'type', 'content']
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
}