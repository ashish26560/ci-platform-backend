'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'theme',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: { type: Sequelize.STRING, allowNull: false },
                    status_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        references: {
                            key: 'id',
                            model: { tableName: 'lookup_details' },
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

            await queryInterface.createTable(
                'skill',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: { type: Sequelize.STRING, allowNull: false },
                    status_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        references: {
                            key: 'id',
                            model: { tableName: 'lookup_details' },
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

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable('theme', { transaction });
            await queryInterface.dropTable('skill', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
