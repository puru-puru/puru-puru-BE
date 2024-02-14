import { Request, Response, NextFunction } from 'express'
import { MyplantsRepository } from '../repositories/myplants.repository'
import { Boards } from '../../models/Boards'


export class MyplantsService {
    myplantsrepository = new MyplantsRepository();

    postMyPlant = async (image: string, name: string, plantAt: Date, user: any ) => {
        try {

            const postMyPlant = await this.myplantsrepository.postMyPlant(
                image, name, plantAt, user
            )

            return postMyPlant;
            
        } catch (err) {
            throw err;
        }
    }

    showMyPlants = async (user: any) => {
        try {
            const postMyPlant = await this.myplantsrepository.showMyPlants(
                user
            )
            return postMyPlant;            
        } catch (err) {
            throw err;
        }
    }
}