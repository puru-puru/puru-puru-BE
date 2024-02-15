import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import {UserPlant} from "./UserPlant";

// 식물 추천 모델 지정.
class Plants extends Model {
  declare plantsId: number;
  declare plantName: string;
  declare type: string;
  declare image: string;
  declare content: string;
}
// 실제 디비에 들어갈 값
Plants.init(
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
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
  },
  {
    sequelize,
    modelName: "Plants",
    tableName: "tb_plant",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);

// UserPlant와의 관계
Plants.hasMany(UserPlant, { foreignKey: 'plantsId' });
UserPlant.belongsTo(Plants, { foreignKey: 'plantsId' });

export { Plants };
