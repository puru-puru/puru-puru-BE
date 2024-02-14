import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import {SavedTemplelates} from "./SavedTemplelates";

// 식물 추천 모델 지정.
class Templelates extends Model {
  declare id: number;
  declare question: string;
}
// 실제 디비에 들어갈 값
Templelates.init(
  {
    templelateId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Templelates",
    tableName: "tb_templelates",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);

// SavedTemplelates와의 관계
Templelates.hasMany(SavedTemplelates, { foreignKey: 'templelateId' });
SavedTemplelates.belongsTo(Templelates, { foreignKey: 'templelateId' });

export { Templelates };