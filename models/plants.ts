import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

// 식물 추천 모델 지정.
class Plants extends Model {
  declare id: number;
  declare nickname?: string;
  declare email: string;
  declare password: string;
  declare hashedRefreshToken: string;
}
// 실제 디비에 들어갈 값
Plants.init(
  {
    id: {
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

export { Plants };
