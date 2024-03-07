import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Comments } from "./Comments";
import { Likes } from "./likes";

class Boards extends Model {
    Likes: any; // 보드 부분에서 좋아요, 카운트 하는 부분을 불러올때 타입 에러가 발생 해서 넣어 주었음.
    Comments: any; // 댓글, 전과동.
  static find(arg0: { where: { deletedAt: null; }; include: { model: typeof import("./Users").Users; attributes: string[]; as: string; }[]; }) {
      throw new Error("Method not implemented.");
  }
  declare boardId: number;
  declare title: string;
  declare image?: string;
  declare content: string;
  declare author: {
      includes(Keyword: string): unknown; nickname: string 
};
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

// 보드와 댓글 관의 관계
Boards.hasMany(Comments, { foreignKey: "boardId" });
Comments.belongsTo(Boards, { foreignKey: "boardId" });

Boards.hasMany(Likes, { foreignKey: 'boardId' });
Likes.belongsTo(Boards, { foreignKey: 'boardId' });

export { Boards };
