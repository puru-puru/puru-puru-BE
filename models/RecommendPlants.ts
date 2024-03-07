import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import {UserPlant} from "./UserPlant";

// 식물 추천 모델 지정.
class RecommendPlants extends Model {
  declare plantsId: number;
  declare plantName: string;
  declare type: string;
  declare image: string;
  declare content: string;
}
// 실제 디비에 들어갈 값
RecommendPlants.init(
  {
    plantsId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    plantName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
  {
    sequelize,
    modelName: "RecoPlants",
    tableName: "tb_recoplant",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);

export { RecommendPlants };