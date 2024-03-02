import { Request, Response, NextFunction } from 'express'
import { TestRepository } from '../repositories/test.repository'
import { Boards } from '../../models/Boards'

interface boardData{
    [boardNum: number]: string;
}

interface tagData{
    [boardNum: number]: string;
}

export class TestService {
    testRepository = new TestRepository();

    getNickName = async () => {
        try {
            return await this.testRepository.getNickName()
        } catch (err) {
            throw err;
        }
    }

    getTestResult = async (boardNum: any) => {
        try {
            const totalDB: any[] = await this.testRepository.getDB()
            
            const boards: boardData = {
                1: '상쾌한',
                2: '수수한',
                3: '다채로운',
                4: '특별한',
                5: '낭만적인',
                6: '향기로운'
            }

            const tags: tagData = {
                1: "공기 정화 식물은 배출 물질을 제거하고 실내 공기를 개선하여 건강에 도움을 줍니다",
                2: "수수한 식물은 조용하고 고요한 매력을 가진 식물로, 실내에서 키우기 쉽고 유지 관리가 비교적 쉽습니다.",
                3: " 각양각색의 아름다움을 자랑하는 식물들이  있고, 생동감 넘치는 색상, 다양한 형태의 잎과 꽃이 특징입니다",
                4: "식물 마니아들과 컬렉터들에게 특별한 자부심을 선사하며, 그들만의 독특한 매력을 지니고 있어요.",
                5: "사랑스럽고 로맨틱한 꽃말을 지닌 아름다운 식물들이 있어요. 특별한 순간을 더욱 로맨틱하게 만들 수있습니다",
                6: "감미로운 향기를 뿜어내는 식물들이 있어요. 향기로운 일상을 만끽해보세요."
            }

            const selectQuotes = tags[boardNum];

            const value = boards[boardNum]
            const filteredDB = totalDB.filter(plant =>{
                return plant.tag.includes(value)
            });

            function shuffelArray(array: any[]): any[]{
                for(let i = array.length -1; i > 0; i--){
                    const j = Math.floor(Math.random()*(i+1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            
            const shuffledDB = shuffelArray(filteredDB);
            const slicedDB = shuffledDB.slice(0,3);
            return {selectQuotes, slicedDB};
        } catch (err) {
            throw err;
        }
    }
}
