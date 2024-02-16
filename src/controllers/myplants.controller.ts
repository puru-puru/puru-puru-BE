// import { User } from '../types/customtype/express'
import { MyplantsService } from '../services/myplants.service'
import { Request, Response, NextFunction } from 'express'
import { where } from 'sequelize';


export class MyplantsController {
    myplantsservice = new MyplantsService();

    postMyPlant = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const { name, plantAt } = req.body
            const imageUrl = (req.file as any)?.location;
            const user: any = req.user;
            const postMyPlant = await this.myplantsservice.postMyPlant(
                name, plantAt, user, imageUrl
            ); 
            return res.status(200).json(postMyPlant) 
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

            return res.status(200).json(showMyPlants) 
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

            return res.status(200).json(answering ) 
        } catch (err) {
            next(err)
        }
    }

    searching = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {keyword} = req.params;
            const searchedResult = await this.myplantsservice.searching(
                keyword
            )

            return res.status(200).json(searchedResult) 
        } catch (err) {
           next(err)
        }
    }

    savePlants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {plantsId} = req.params;
            const user: any = req.user;
            const savePlants = await this.myplantsservice.savePlants(
                user, plantsId
            );

            return res.status(200).json({ data: savePlants}) 
        } catch (err) {
            next(err)
        }
    }

    deletePlants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {diaryId} = req.params;
            const deletePlants = await this.myplantsservice.deletePlants(
                diaryId
            );

            return res.status(200).json(deletePlants) 
        } catch (err) {
            next(err)
        }
    }
    
    newPlants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {plantName, type, content} = req.body;
            const user: any = req.user;
            const newPlants = await this.myplantsservice.newPlants(
                user, plantName, type, content
            );

            return res.status(200).json(newPlants) 
        } catch (err) {
            next(err)
        }
    }
}