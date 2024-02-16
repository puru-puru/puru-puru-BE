// Users 모델
import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Boards } from './Boards'
import { Diaries } from './Diaries'
import { Comments } from './Comments'
import { Likes } from './likes'

class Users extends Model {
  declare userId: number;
  declare nickname?: string;
  declare email: string;
  declare password: string;
  declare hashedRefreshToken: string;
  declare agreedService: boolean;
}

Users.init(
  {
    userId: {
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

// Users와 Boards 간의 관계 설정
Users.hasMany(Boards, { foreignKey: 'userId' });
Boards.belongsTo(Users, { foreignKey: 'userId', as: 'author' });

Users.hasMany(Diaries, { foreignKey: "userId" })
Diaries.belongsTo(Users, { foreignKey: 'userId' })

Users.hasMany(Comments, { foreignKey: 'userId' })
Comments.belongsTo(Users, { foreignKey: "userId" })

Users.hasMany(Likes, { foreignKey: "userId" })
Likes.belongsTo(Users, { foreignKey: "userId" })

export { Users };