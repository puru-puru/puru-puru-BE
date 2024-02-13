import { Request, Response, NextFunction } from 'express'
import { MainRepository } from '../repositories/main.repository'
import { TestRepository } from '../repositories/test.repository'


export class MainService {
    mainRepository = new MainRepository();
    testRepository = new TestRepository();

    getInfo = async () => {
        try {
            const missions: any[] = await this.mainRepository.getInfo();
            const plants: any[] = await this.testRepository.getDB()
            
            const randomMission = this.getRandom(missions);
            const randomPlant = this.getRandom(plants)

            return {mission: randomMission, plant: randomPlant}
        } catch (err) {
            throw err;
        }
    }

    getRandom = (array: any[]) =>{
        var randomElement = array[Math.floor(Math.random()*array.length)];
        return randomElement;
    }
}