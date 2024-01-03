'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'country',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                    },
                    ISO: {
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
            await queryInterface.createTable(
                'city',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    country_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            key: 'id',
                            model: { tableName: 'country' },
                        },
                    },
                    name: { type: Sequelize.STRING },
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
            await queryInterface.dropTable('country', { transaction });
            await queryInterface.dropTable('city', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
