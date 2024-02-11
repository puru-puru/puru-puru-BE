import { Request, Response, NextFunction } from 'express'
import { MainRepository } from '../repositories/main.repository'
import { Boards } from '../../models/Boards'


export class MainService {
    mainRepository = new MainRepository();

    getInfo = async () => {
        try {
            return await this.mainRepository.getInfo()
        } catch (err) {
            throw err;
        }
    }

}