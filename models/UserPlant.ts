import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

// 식물 추천 모델 지정.
class UserPlant extends Model {
  declare id: number;
  declare name: string;
}
// 실제 디비에 들어갈 값
UserPlant.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "UserPlant",
    tableName: "tb_userplant",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);


export { UserPlant };