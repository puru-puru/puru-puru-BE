import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Galleries } from './Galleries'

// 식물 추천 모델 지정.
class UserPlant extends Model {
  declare userplantId: number;
}
// 실제 디비에 들어갈 값
UserPlant.init(
  {
    userplantId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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

