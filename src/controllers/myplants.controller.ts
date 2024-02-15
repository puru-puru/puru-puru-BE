// import { User } from '../types/customtype/express'
import { MyplantsService } from '../services/myplants.service'
import { Request, Response, NextFunction } from 'express'
import { where } from 'sequelize';


export class MyplantsController {
    myplantsservice = new MyplantsService();

    postMyPlant = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const { image, name, plantAt } = req.body
            const user: any = req.user;
            const postMyPlant = await this.myplantsservice.postMyPlant(
                image, name, plantAt, user 
            ); 
            return res.status(200).json({ data: postMyPlant }) 
        } catch (err) {
            next(err)
        }
    }

    showMyPlants = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const user: any = req.user;
            const showMyPlants = await this.myplantsservice.showMyPlants(
                user
            ); 

            return res.status(200).json({ data: showMyPlants }) 
        } catch (err) {
            next(err)
        }
    }

    answering = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const user: any = req.user;
            const {diaryId, templelateId }= req.params;
            const answering = await this.myplantsservice.answering(
                user, diaryId, templelateId
            ); 

            return res.status(200).json({ data: answering }) 
        } catch (err) {
            next(err)
        }
    }


}