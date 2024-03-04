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
            const missions: any[] = await this.mainRepository.getInfo();
            const plants: any[] = await this.mainRepository.getSelectedDB();

            const shuffleMission = this.shuffelArray(missions);
            const randomMission = shuffleMission.slice(0,3);

            return { mission: randomMission, plant: plants, loginUser }
        } catch (err) {
            throw err;
        }
    }

    getRandom = (array: any[]) => {
        var randomElement = array[Math.floor(Math.random() * array.length)];
        return randomElement;
    }


    shuffelArray = (array: any[]): any[] => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

}