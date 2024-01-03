import { DataTypes } from 'sequelize';

export default function LookupDetailsModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        lookup_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'lookup',
                key: 'id',
            },
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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

    const lookup_details = sequelize.define(
        'lookup_details',
        attributes,
        options
    );

    lookup_details.associate = function (models) {
        lookup_details.belongsTo(models.lookup, {
            foreignKey: 'lookup_id',
            as: 'lookup',
        });
        lookup_details.hasMany(models.mission, {
            foreignKey: 'mission_type_id',
            as: 'mission_type_missions',
        });
        lookup_details.hasMany(models.mission, {
            foreignKey: 'availability_id',
            as: 'availability_missions',
        });
        lookup_details.hasMany(models.theme, {
            foreignKey: 'status_id',
            as: 'theme_status',
        });
        lookup_details.hasMany(models.skill, {
            foreignKey: 'status_id',
            as: 'skill_status',
        });
    };

    return lookup_details;
}
