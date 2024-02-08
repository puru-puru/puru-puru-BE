import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Missions extends Model {
    declare id: number;
    declare content: string;
}

Missions.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: "Missions",
        tableName: "tb_mission",
        freezeTableName: true,
        timestamps: true, // 이거로 createdAt, updatedAt 적용
        paranoid: true, // deletedAt 구현.
        underscored: false,
      }
)

export { Missions }