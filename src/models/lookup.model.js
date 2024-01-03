import { DataTypes } from 'sequelize';

export default function lookupModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        code: { type: DataTypes.STRING, allowNull: false },
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

    const lookup = sequelize.define('lookup', attributes, options);

    lookup.associate = function (models) {
        lookup.hasMany(models.lookup_details, {
            foreignKey: 'lookup_id',
            as: 'lookup_details',
        });
    };

    return lookup;
}
