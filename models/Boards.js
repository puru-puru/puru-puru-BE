"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boards = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
// 게시판 지정
class Boards extends sequelize_1.Model {
}
exports.Boards = Boards;
Boards.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: index_1.default,
    modelName: "Boards",
    tableName: "tb_board",
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: false,
});
