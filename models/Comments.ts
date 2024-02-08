import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Comments extends Model {
  declare id: number;
  declare content: string;
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
