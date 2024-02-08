import { Request, Response, NextFunction } from 'express'
import { TestRepository } from '../repositories/test.repository'
import { Boards } from '../../models/Boards'


export class TestService {
    testRepository = new TestRepository();
    
    getNickName = async () => {
        try {
            return await this.testRepository.getNickName() 
        } catch (err) {
            throw err;
        }
    }

    getTestResult = async () => {
        try {
            return await this.testRepository.getTestResult() 
        } catch (err) {
            throw err;
        }
    }
}