// models/country.model.js

import { DataTypes } from 'sequelize';

export default function CountryModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        ISO: {
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

    const country = sequelize.define('country', attributes, options);

    country.associate = function (models) {
        country.hasMany(models.city, {
            foreignKey: 'country_id',
            as: 'cities',
        });
        country.hasMany(models.mission, {
            foreignKey: 'country_id',
            as: 'missions',
        });
    };

    return country;
}
