// import { User } from '../types/customtype/express'
import { TestService } from '../services/test.service'
import { Request, Response, NextFunction } from 'express'
import { Boards } from '../../models/Boards'
import { where } from 'sequelize';


export class TestController {
    testService = new TestService();

    getNickName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getNickName = await this.testService.getNickName(); 
            return res.status(200).json({ data: getNickName }) 
        } catch (err) {
            next(err)
        }
    }
    
    getTestResult = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { boardNum } = req.body
            const getTestResult = await this.testService.getTestResult(
                boardNum
            ); 
            return res.status(200).json({ data: getTestResult }) 
        } catch (err) {
            next(err)
        }
    }
}
