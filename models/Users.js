"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const Boards_1 = require("./Boards");
// 유저 모델 지정.
class Users extends sequelize_1.Model {
}
exports.Users = Users;
// 실제 디비에 들어갈 값
Users.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nickname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    hashedRefreshToken: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: index_1.default,
    modelName: "Users",
    tableName: "tb_user",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
});
Users.hasMany(Boards_1.Boards, { foreignKey: 'id' });
Boards_1.Boards.belongsTo(Users, { foreignKey: 'id' });
