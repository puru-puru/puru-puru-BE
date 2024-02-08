import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Comments } from "./Comments";

// 게시판 지정
class Boards extends Model {
  declare id: number;
  declare title: string;
  declare image?: string;
  declare content: string;
}

Boards.init(
  {
    id: {
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

// 보드와 댓글 관의 관계
Boards.hasMany(Comments, { foreignKey: "id" });
Comments.belongsTo(Boards, { foreignKey: "id" });

export { Boards };
