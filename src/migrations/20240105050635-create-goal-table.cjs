'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'goal',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    objective: {
                        allowNull: false,
                        type: Sequelize.STRING,
                    },
                    target: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                    },
                    achieved: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                    },
                    mission_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: { tableName: 'mission' },
                        },
                        onDelete: 'CASCADE',
                    },
                    created_date: {
                        allowNull: false,
                        type: Sequelize.STRING,
                    },
                    updated_date: {
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
            await queryInterface.dropTable('goal', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
