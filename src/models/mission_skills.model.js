// models/mission_skills.model.js

import { DataTypes } from 'sequelize';

export default function MissionSkillModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        mission_id: {
            type: DataTypes.INTEGER,
            references: {
                key: 'id',
                model: 'mission',
            },
        },
        skill_id: {
            type: DataTypes.INTEGER,
            references: {
                key: 'id',
                model: 'skill',
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

    const mission_skills = sequelize.define(
        'mission_skills',
        attributes,
        options
    );

    mission_skills.associate = function (models) {
        mission_skills.belongsTo(models.mission, {
            foreignKey: 'mission_id',
            as: 'mission',
            onDelete: 'CASCADE',
        });
        mission_skills.belongsTo(models.skill, {
            foreignKey: 'skill_id',
            as: 'skill',
        });
    };

    return mission_skills;
}
