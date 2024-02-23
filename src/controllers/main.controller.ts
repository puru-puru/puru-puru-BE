import { MainService } from '../services/main.service'
import { Request, Response, NextFunction } from 'express'
import { Boards } from '../../models/Boards'
import { where } from 'sequelize';


export class MainController {
    mainService = new MainService();
 
    getInfo = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const user: any = req.user
            const getInfo = await this.mainService.getInfo(user.nickname); 

            return res.status(200).json({ data: getInfo }) 
        } catch (err) {
            next(err)
        }
    }
}