'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'lookup',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    code: { type: Sequelize.STRING, allowNull: false },
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
                'lookup_details',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    lookup_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: { tableName: 'lookup' },
                        },
                    },
                    code: {
                        allowNull: false,
                        type: Sequelize.STRING,
                    },
                    name: {
                        allowNull: false,
                        type: Sequelize.STRING,
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
            await queryInterface.dropTable('lookup', { transaction });
            await queryInterface.dropTable('lookup_details', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
