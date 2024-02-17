import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

// 식물 추천 모델 지정.
class SavedTemplelates extends Model {
  declare id: number;
  declare answer: string;
}
// 실제 디비에 들어갈 값
SavedTemplelates.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "SavedTemplelates",
    tableName: "tb_savedtemplelates",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);


export { SavedTemplelates };