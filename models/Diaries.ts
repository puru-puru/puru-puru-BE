import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Comments } from './Comments'

class Diaries extends Model {
    declare id: number;
    declare title: string;
    declare image?: string;
    declare content: string;
    declare plantAt: string;
}

Diaries.init(
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plantAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "Diaries",
    tableName: "tb_diary",
    freezeTableName: true,
    timestamps: true, // 이거로 createdAt, updatedAt 적용
    paranoid: true, // deletedAt 구현.
    underscored: false,
  }
)



export { Diaries }