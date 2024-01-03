import { DataTypes } from 'sequelize';

export default function MissionModel(sequelize) {
    const attributes = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        city_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'city',
                key: 'id',
            },
        },
        country_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'country',
                key: 'id',
            },
        },
        theme_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'theme',
                key: 'id',
            },
        },
        availability_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'lookup_details',
                key: 'id',
            },
        },
        mission_type_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'lookup_details',
                key: 'id',
            },
        },
        title: {
            required: true,
            type: DataTypes.STRING,
        },
        description: {
            required: true,
            type: DataTypes.STRING,
        },
        short_description: {
            required: true,
            type: DataTypes.STRING,
        },
        organization_name: {
            required: true,
            type: DataTypes.STRING,
        },
        organization_detail: {
            required: true,
            type: DataTypes.STRING,
        },
        start_date: {
            type: DataTypes.DATE,
        },
        end_date: {
            type: DataTypes.DATE,
        },
        deadline: {
            type: DataTypes.DATE,
        },
        total_seats: {
            type: DataTypes.INTEGER,
        },
        seats_left: { type: DataTypes.INTEGER },
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

    const mission = sequelize.define('mission', attributes, options);

    mission.associate = function (models) {
        mission.belongsTo(models.city, {
            foreignKey: 'city_id',
            as: 'city',
        });
        mission.belongsTo(models.country, {
            foreignKey: 'country_id',
            as: 'country',
        });
        mission.belongsTo(models.lookup_details, {
            foreignKey: 'availability_id',
            as: 'availability',
        });
        mission.belongsTo(models.lookup_details, {
            foreignKey: 'mission_type_id',
            as: 'mission_type',
        });
    };

    return mission;
}
