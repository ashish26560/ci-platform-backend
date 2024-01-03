'use strict';

const lookupData = [
    {
        name: 'Availability',
        code: 'AVAILABILITY',
        details: ['Daily', 'Weekly', 'Monthly', 'Weekend'],
    },
    {
        name: 'Mission Type',
        code: 'MISSION_TYPE',
        details: ['Goal', 'Time'],
    },
    {
        name: 'Status',
        code: 'STATUS',
        details: [
            'Active',
            'Inactive',
            'Pending',
            'Applied',
            'Completed',
            'Approved',
            'Published',
        ],
    },
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkInsert(
                'lookup',
                lookupData.map((lookup) => ({
                    code: lookup.code,
                    created_date: new Date(),
                    updated_date: new Date(),
                })),
                { transaction }
            );

            const lookups = await queryInterface.sequelize.query(
                'SELECT id, code from lookup;',
                { transaction }
            );

            console.log(
                '---------------------lookups--------------------------',
                lookups
            );

            const lookupIds = lookups[0].map((lookup) => lookup.id);

            const lookupDetails = lookupData.flatMap((lookup, index) => {
                const lookupId = lookupIds[index];
                return lookup.details.map((value) => ({
                    name: value,
                    code: value.toUpperCase(),
                    lookup_id: lookupId,
                    created_date: new Date(),
                    updated_date: new Date(),
                }));
            });

            await queryInterface.bulkInsert('lookup_details', lookupDetails, {
                transaction,
            });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkDelete('lookup_details', null, {
                transaction,
            });
            await queryInterface.bulkDelete('lookup', null, { transaction });
        } catch (err) {
            await transaction.commit();
            throw err;
        }
    },
};
