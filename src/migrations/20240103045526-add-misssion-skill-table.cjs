'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'mission_skills',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    mission_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: 'mission',
                        },
                        onDelete: 'CASCADE',
                    },
                    skill_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: 'skill',
                        },
                    },
                    created_date: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updated_date: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                },
                { transaction }
            );

            await queryInterface.removeColumn('mission', 'created_date', {
                transaction,
            });
            await queryInterface.removeColumn('mission', 'uploaded_date', {
                transaction,
            });

            await queryInterface.addColumn(
                'mission',
                'updated_date',
                {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                { transaction }
            );

            await queryInterface.addColumn(
                'mission',
                'created_date',
                {
                    allowNull: false,
                    type: Sequelize.DATE,
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
            await queryInterface.dropTable('mission_skills', { transaction });

            await queryInterface.addColumn(
                'mission',
                'uploaded_date',
                {
                    allowNull: false,
                    type: Sequelize.STRING,
                },
                { transaction }
            );

            await queryInterface.removeColumn('mission', 'created_date', {
                transaction,
            });
            await queryInterface.removeColumn('mission', 'updated_date', {
                transaction,
            });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
