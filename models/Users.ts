import { DATE, DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface UsersAttributes { // 타입스크립트 에서 접근할 모델을 정의
  userId: Number
  nickname: String;
  email: String;
  password: String;
  type: String
}

export class Users extends Model<UsersAttributes> { // 실제 DB에 들어갈 타입과 옵션.
  userId: Number | undefined
  nickname: String | undefined
  email: String | undefined
  password: String | undefined
  type: String | undefined
}

Users.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('CLIENT', 'ADMIN'),
            defaultValue: 'CLIENT',
            allowNull: false

        }
    },
    {
        sequelize, // 꼭 넣어줘야 함
        modelName: "Users",
        tableName: "tb_user",
        freezeTableName: true, // 테이블명 변경 불가
        timestamps: true, // create_at, updated_at 컬럼 생성
        paranoid: true, // deleted_at 컬럼 생성, soft delete 시 나중에 복구 가능
        underscored: false, // 위 세 가지 타임스탬프의 컬럼명 표기법 설정, true로 하면 snake case / false면 camel case
    },
)