// models/theme.model.js

import { DataTypes } from 'sequelize';

export default function SkillModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status_id: {
            type: DataTypes.INTEGER,
            references: {
                key: 'id',
                model: 'lookup_details',
            },
        },
        created_date: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updated_date: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    };

    const options = {
        freezeTableName: true,
        timestamps: false,
    };

    const theme = sequelize.define('theme', attributes, options);

    theme.associate = function (models) {
        theme.belongsTo(models.lookup_details, {
            foreignKey: 'status_id',
            as: 'status',
        });
    };

    return theme;
}
