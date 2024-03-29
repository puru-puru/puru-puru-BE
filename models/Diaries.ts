import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { SavedTemplelates } from './SavedTemplelates'
import { UserPlant } from './UserPlant'
import { Galleries } from "./Galleries";

class Diaries extends Model {
    declare diaryId: number;
    declare image?: string;
    declare name: string;
    declare plantAt: string;
}

Diaries.init(
    {
    diaryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plantAt: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "Diaries",
    tableName: "tb_diary",
    freezeTableName: true,
    timestamps: true, // 이거로 createdAt, updatedAt 적용
    paranoid: true, // deletedAt 구현.
    underscored: false,
  }
)

// SavedTemplelates와의 관계
Diaries.hasMany(SavedTemplelates, { foreignKey: 'diaryId' });
SavedTemplelates.belongsTo(Diaries, { foreignKey: 'diaryId' });

// UserPlant와의 관계
Diaries.hasOne(UserPlant, { foreignKey: 'diaryId' });
UserPlant.belongsTo(Diaries, { foreignKey: 'diaryId' });

// 갤러리 와의 관계
Diaries.hasMany(Galleries, { foreignKey: "diaryId" }) 
Galleries.belongsTo(Diaries, { foreignKey: "diaryId" })

export { Diaries }