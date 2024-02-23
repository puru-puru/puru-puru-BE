import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Likes extends Model {
    declare id: number;
}

Likes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        }
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