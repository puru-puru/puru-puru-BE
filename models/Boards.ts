import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { Users } from './Users'

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

// Users.hasMany(Boards, { foreignKey: 'id' });
// Boards.belongsTo(Users, { foreignKey: 'id' });

export { Boards };
