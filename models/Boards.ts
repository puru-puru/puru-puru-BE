// Boards 모델
import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Comments } from "./Comments";

class Boards extends Model {
  declare boardId: number;
  declare title: string;
  declare image?: string;
  declare content: string;
}

Boards.init(
  {
    boardId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Boards",
    tableName: "tb_board",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);

// Boards와 Comments 간의 관계 설정
Boards.hasMany(Comments, { foreignKey: "boardId" });
Comments.belongsTo(Boards, { foreignKey: "boardId" });

export { Boards };
