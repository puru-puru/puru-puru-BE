import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Boards } from './Boards'

// 유저 모델 지정.
class Users extends Model {
  declare id: number;
  declare nickname?: string;
  declare email: string;
  declare password: string;
  declare hashedRefreshToken: string;
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

Users.hasMany(Boards, { foreignKey: 'id' });
Boards.belongsTo(Users, { foreignKey: 'id' });

export { Users };
