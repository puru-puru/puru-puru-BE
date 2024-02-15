import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Boards } from './Boards'
import { Diaries } from './Diaries'
import { Comments } from './Comments'
import { Likes } from './likes'

// 유저 모델 지정.
class Users extends Model {
  declare id: number;
  declare nickname?: string;
  declare email: string;
  declare password: string;
  declare hashedRefreshToken: string;
  declare agreedService: boolean;
}
// 실제 디비에 들어갈 값
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedRefreshToken: {
      type: DataTypes.STRING
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    agreedService: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: "Users",
    tableName: "tb_user",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
  }
);

// 게시판 과 관계
Users.hasMany(Boards, { foreignKey: 'id' });
Boards.belongsTo(Users, { foreignKey: 'id' });

// 반려 식물 일지 관계
Users.hasMany(Diaries, { foreignKey: "id" })
Diaries.belongsTo(Users, { foreignKey: 'id' })

// 댓글 과의 관계
Users.hasMany(Comments, { foreignKey: 'id' })
Comments.belongsTo(Users, { foreignKey: "id" })

// 좋아요 와의 관계
Users.hasMany(Likes, { foreignKey: "id" })
Likes.belongsTo(Users, { foreignKey: "id" })

export { Users };
