import { Plants } from "../../models/plants";
import { RecommendPlants } from "../../models/RecommendPlants";
import { Diaries } from "../../models/Diaries";
import { Templelates } from "../../models/Templelates";
import { SavedTemplelates } from "../../models/SavedTemplelates";
import cron from "node-cron";


export function initializeCronJob() {
    cron.schedule('* * * * *', async () => {
        try {
            const questions = await SavedTemplelates.update({ deletedAt: Date() }, {
                where: { deletedAt: null }
            })
            console.log('데이터 삭제처리 완료');
            console.log(`찾은 질문들 : ${questions}`)
        } catch (error) {
            console.error('데이터 삭제처리 실패:', error);
        }
    });
}

export function initializeCronRecomendation(){
    cron.schedule('0 0 1 * *', async () => {
        try {
            const recoplants = await RecommendPlants.update({ deletedAt: Date() }, {
                where: { deletedAt: null }
            });
            console.log('데이터 삭제처리 완료');
            const plantsDB = await Plants.findAll();

            function shuffelArray(array: any[]){
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            const shuffelPlants = shuffelArray(plantsDB);
            const slicedPlants = shuffelPlants.slice(0,3);
            const mappedPlants = slicedPlants.map(plant =>({
                plantName: plant.plantName,
                type: plant.type,
                image: plant.image,
                content: plant.content,
                tag: plant.tag
            }))
            
            const newRecommendation = await RecommendPlants.bulkCreate(mappedPlants);


            console.log(`생성된 식물들 : ${newRecommendation}`)
        } catch (error) {
            console.error('데이터 삭제처리 실패:', error);
        }
    });
}

module.exports = {
    initializeCronJob: initializeCronJob,
    initializeCronRecomendation: initializeCronRecomendation
};