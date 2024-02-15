import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Galleries extends Model {
    declare id: number;
    declare image: string;
}

Galleries.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        image: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        modelName: "Galleries",
        tableName: "tb_gallery",
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        underscored: false,
      }
)

export { Galleries }