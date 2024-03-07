import { Request, Response, NextFunction } from 'express'
import { MainRepository } from '../repositories/main.repository'
import { TestRepository } from '../repositories/test.repository'
import { UserRepository } from '../repositories/user.repository';


export class MainService {
    mainRepository = new MainRepository();
    testRepository = new TestRepository();
    userRepository = new UserRepository()

    getInfo = async (loginUser: string) => {
        try {
            // 미션은 missionDB에서 먼저 전부 다 가져온다.
            const missions: any[] = await this.mainRepository.getInfo();
            // 식물은 RecommendPlantsDB에서 가져오는데, 정확히 3개만 가져오므로,
            // 따로 여기서 처리할 필요가 없이 그대로 화면에 뿌려주면 된다.
            const plants: any[] = await this.mainRepository.getSelectedDB();

            // 가져온 미션들의 순서를 뒤죽박죽 바꾼다.
            const shuffleMission = this.shuffelArray(missions);
            // 순서가 뒤엉킨 미션 중 앞에서 3개만 자른다.
            const randomMission = shuffleMission.slice(0,3);

            // 미션 3개 식물 3개를 화면으로 보낸다.
            return { mission: randomMission, plant: plants, loginUser }
        } catch (err) {
            throw err;
        }
    }


    getRandom = (array: any[]) => {
        var randomElement = array[Math.floor(Math.random() * array.length)];
        return randomElement;
    }

    // 순서를 뒤죽박죽 바꾸는 메서드
    shuffelArray = (array: any[]): any[] => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

}