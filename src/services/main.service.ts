import { Request, Response, NextFunction } from 'express'
import { MainRepository } from '../repositories/main.repository'
import { TestRepository } from '../repositories/test.repository'


export class MainService {
    mainRepository = new MainRepository();
    testRepository = new TestRepository();

    getInfo = async () => {
        try {
            const missions: any[] = await this.mainRepository.getInfo();
            const plants: any[] = await this.mainRepository.getSelectedDB();

            const shuffleMission = this.shuffelArray(missions);
            const shuffelPlants = this.shuffelArray(plants);
            const randomPlants = shuffelPlants.slice(0,3);
            const randomMission = shuffleMission.slice(0,3);

            return { mission: randomMission, plant: randomPlants }
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