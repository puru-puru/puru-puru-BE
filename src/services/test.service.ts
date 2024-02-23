import { Request, Response, NextFunction } from 'express'
import { TestRepository } from '../repositories/test.repository'
import { Boards } from '../../models/Boards'

interface boardData{
    [boardNum: number]: string;
}

export class TestService {
    testRepository = new TestRepository();

    getNickName = async () => {
        try {
            return await this.testRepository.getNickName()
        } catch (err) {
            throw err;
        }
    }

    getTestResult = async (boardNum: any) => {
        try {
            const totalDB: any[] = await this.testRepository.getDB()
            
            const boards: boardData = {
                1: '상쾌한',
                2: '수수한',
                3: '다채로운',
                4: '특별한',
                5: '낭만적인',
                6: '향기로운'
            }
            const value = boards[boardNum]
            const filteredDB = totalDB.filter(plant =>{
                return plant.tag.includes(value)
            });

            function shuffelArray(array: any[]): any[]{
                for(let i = array.length -1; i > 0; i--){
                    const j = Math.floor(Math.random()*(i+1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            
            const shuffledDB = shuffelArray(filteredDB);
            const slicedDB = shuffledDB.slice(0,3);
            return slicedDB;
        } catch (err) {
            throw err;
        }
    }
}
