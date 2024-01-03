'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'mission',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    city_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: { tableName: 'city' },
                        },
                    },
                    country_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: { tableName: 'country' },
                        },
                    },
                    availability_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: { tableName: 'lookup_details' },
                        },
                    },
                    mission_type_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: { tableName: 'lookup_details' },
                        },
                    },
                    title: {
                        required: true,
                        type: Sequelize.STRING,
                    },
                    description: {
                        required: true,
                        type: Sequelize.STRING,
                    },
                    short_description: {
                        required: true,
                        type: Sequelize.STRING,
                    },
                    organization_name: {
                        required: true,
                        type: Sequelize.STRING,
                    },
                    organization_detail: {
                        required: true,
                        type: Sequelize.STRING,
                    },
                    start_date: {
                        type: Sequelize.DATE,
                    },
                    end_date: {
                        type: Sequelize.DATE,
                    },
                    deadline: {
                        type: Sequelize.DATE,
                    },
                    total_seats: {
                        type: Sequelize.INTEGER,
                    },
                    seats_left: { type: Sequelize.INTEGER },
                    created_date: {
                        allowNull: false,
                        type: Sequelize.STRING,
                    },
                    uploaded_date: {
                        allowNull: false,
                        type: Sequelize.STRING,
                    },
                },
                { transaction }
            );

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable('mission', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
