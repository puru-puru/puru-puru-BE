import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Comments extends Model {
  declare id: number;
  declare content: string;
  declare boardId: number; 
}

Comments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    boardId: { // boardId 추가
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'tb_board', // 게시물 테이블에 따라 수정
          key: 'boardId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
  },
  },
  {
    sequelize,
    modelName: "Comments",
    tableName: "tb_comment",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);

export { Comments };
