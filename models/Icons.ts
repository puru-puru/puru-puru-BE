import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Icons extends Model {
    declare id: number;
    declare image: string;
}

Icons.init(
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
        modelName: "Icons",
        tableName: "tb_icon",
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        underscored: false,
    }
)

export { Icons }