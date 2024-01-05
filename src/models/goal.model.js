// models/goal.model.js

import { DataTypes } from 'sequelize';

export default function GoalModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        mission_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        objective: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        target: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        achieved: {
            allowNull: false,
            type: DataTypes.INTEGER,
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

    const goal = sequelize.define('goal', attributes, options);

    goal.associate = function (models) {
        goal.belongsTo(models.mission, {
            foreignKey: 'mission_id',
            as: 'mission',
        });
    };

    return goal;
}
