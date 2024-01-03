// models/city.model.js

import { DataTypes } from 'sequelize';

export default function CityModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        country_id: {
            type: DataTypes.INTEGER,
            references: {
                key: 'id',
                model: 'country',
            },
        },
        name: {
            type: DataTypes.STRING,
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

    const city = sequelize.define('city', attributes, options);

    city.associate = function (models) {
        city.belongsTo(models.country, {
            foreignKey: 'country_id',
            as: 'country',
        });
        city.hasMany(models.mission, {
            foreignKey: 'country_id',
            as: 'missions',
        });
    };

    return city;
}
