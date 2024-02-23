import { Request, Response, NextFunction } from 'express'
import { MyplantsRepository } from '../repositories/myplants.repository'
import { Boards } from '../../models/Boards'
import { TestRepository } from '../repositories/test.repository'

export class MyplantsService {
    myplantsrepository = new MyplantsRepository();
    testrepository = new TestRepository();

    postMyPlant = async ( name: string, plantAt: string, user: any, imageUrl: string) => {
        try {

            const postMyPlant = await this.myplantsrepository.postMyPlant(
                name, plantAt, user, imageUrl
            )

            return postMyPlant;

        } catch (err) {
            throw err;
        }
    }

    showMyPlants = async (user: any) => {
        try {
            const showMyPlant = await this.myplantsrepository.showMyPlants(
                user
            )

            return showMyPlant;
        } catch (err) {
            throw err;
        }
    }

    answering = async (user: any, diaryId: any, templateId: any, answer: any) => {
        try {
            const answering = await this.myplantsrepository.answering(
                user, diaryId, templateId, answer
            )
            return answering;
        } catch (err) {
            throw err;
        }
    }

    searching = async (keyword: string) => {
        try {
            const totalDB: any[] = await this.testrepository.getDB();

            const filteredDB = totalDB.filter(plant => {
                return plant.plantName.includes(keyword) || plant.type.includes(keyword)
            });
            return filteredDB;
        } catch (err) {
            throw err;
        }
    }

    savePlants = async (user: any, plantsId: any) => {
        try {
            const savePlants = await this.myplantsrepository.savePlants(
                user, plantsId
            );

            return savePlants;
        } catch (err) {
            throw err;
        }
    }

    deletePlants = async (diaryId: any) => {
        try {
            const deletePlants = await this.myplantsrepository.deletePlants(
                diaryId
            );
            return deletePlants;
        } catch (err) {
            throw err;
        }
    }

    newPlants = async (user: any, plantName: string, type: string, content: string) => {
        try {
            const newPlants = await this.myplantsrepository.newPlants(
                user, plantName, type, content
            );

            return newPlants;
        } catch (err) {
            throw err;
        }
    }
}