// import { User } from '../types/customtype/express'
import { MyplantsService } from '../services/myplants.service'
import { Request, Response, NextFunction } from 'express'
import { where } from 'sequelize';
import Joi from "joi";

// 식물 이름(별명)은 2자 이상 10자 이하로. 특수문자 허용 안함
// 식물 시작일자는 문자열로 yyyy-mm-dd로 입력만 받도록 함 
const diarySchema = Joi.object({
    image: Joi.string(),
    name: Joi.string().pattern(new RegExp("^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]{2,10}$")).required(),
    plantAt: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
  });
// 질문에 대한 답변은 5자이상 25자 이하로.
const answerSchema = Joi.object({
    answer: Joi.string().pattern(new RegExp("^[\\s\\S]{5,25}$")).required(),
})
// 식물 이름(별명)은 2자 이상 10자 이하로. 특수문자 허용 안함
// 식물 타입은 2자 이상 6자 이하로. 특수문자 허용 안함
// 컨텐츠는 5자이상 25자 이하로.
const newPlantSchema = Joi.object({
    plantName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]{2,10}$")).required(),
    type:Joi.string().pattern(new RegExp("^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]{2,10}$")).required(),
    content:Joi.string().pattern(new RegExp("^[\\s\\S]{5,50}$")).required(),
})

export class MyplantsController {
    myplantsservice = new MyplantsService();

    postMyPlant = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const { name, plantAt } = await diarySchema.validateAsync(req.body);
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
            const {answer}= await answerSchema.validateAsync(req.body);
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
            const {plantName, type, content} = await newPlantSchema.validateAsync(req.body);
            const user: any = req.user;
            const newPlants = await this.myplantsservice.newPlants(
                user, plantName, type, content
            );

            return res.status(200).json(newPlants) 
        } catch (err) {
            next(err)
        }
    }

    postImage = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const imageUrl = (req.file as any)?.location;
            const postImage = await this.myplantsservice.postImage(
                imageUrl
            ); 
            return res.status(200).json(postImage) 
        } catch (err) {
            next(err)
        }
    }
}