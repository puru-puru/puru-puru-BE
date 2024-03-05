import { DataTypes, Model } from "sequelize";
import { Users } from "./Users";
import sequelize from "./index";

class Likes extends Model {
    declare id: number;
    declare userId: number; 
    declare user: Users;
    declare boardId: number;
}

Likes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER, // Users 모델의 userId와 일치해야 함
            allowNull: false,
            references: {
                model: 'tb_user', // 'Users' 대신 'tb_user'로 수정
                key: 'userId',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE', // 필요에 따라 수정 가능
        },
        boardId: { // boardId 추가
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tb_board', // 게시물 테이블에 따라 수정
                key: 'boardId',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: "Likes",
        tableName: "tb_like",
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        underscored: false,
    }
)

export { Likes }