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

// plantDB에서 데이터를 가져와 1 개월 주기로 식물을 뿌려주는 역할을 한다
export function initializeCronRecomendation(){
    cron.schedule('0 0 1 * *', async () => {
        try {
            // 새롭게 식물을 가져오기 전, RecommendPlants에 있는 모든 식물을 삭제 처리한다
            const recoplants = await RecommendPlants.update({ deletedAt: Date() }, {
                where: { deletedAt: null }
            });
            console.log('데이터 삭제처리 완료');
            // 기존 plantsDB에서 모든 식물을 가져온다
            const plantsDB = await Plants.findAll();

            function shuffelArray(array: any[]){
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            // 가져온 모든 식물의 순서가 DB와 동일하니, 이를 뒤죽박죽 바꾼다.
            const shuffelPlants = shuffelArray(plantsDB);
            // 이후 앞에서 3개만 짤라서 가져온다.
            const slicedPlants = shuffelPlants.slice(0,3);
            // 잘라서 나온 3개의 식물을 RecommendPlants DB에 자리에 맞게 조립한다.
            const mappedPlants = slicedPlants.map(plant =>({
                plantName: plant.plantName,
                type: plant.type,
                image: plant.image,
                content: plant.content,
                tag: plant.tag
            }))
            // 이후 RecommendPlants DB에 본격적으로 넣는다.
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