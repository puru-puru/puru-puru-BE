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
            const {diaryId, templateId }= req.params;
            const {answer}= req.body;
            const answering = await this.myplantsservice.answering(
                user, diaryId, templateId, answer
            ); 

            return res.status(200).json({ data: answering }) 
        } catch (err) {
            next(err)
        }
    }

    searching = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {keyword} = req.body;
            const searchedResult = await this.myplantsservice.searching(
                keyword
            )

            return res.status(200).json({ data: searchedResult }) 
        } catch (err) {
           
        }
    }

    savePlants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {diaryId} = req.params;
            const {plantsId} = req.body;
            const savePlants = await this.myplantsservice.savePlants(
                diaryId, plantsId
            );

            return res.status(200).json({ data: savePlants}) 
        } catch (err) {
           
        }
    }
}