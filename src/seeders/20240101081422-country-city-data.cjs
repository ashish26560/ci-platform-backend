'use strict';

const countriesData = [
    {
        name: 'United States',
        iso: 'US',
        cities: ['New York', 'Los Angeles', 'Chicago'],
    },
    {
        name: 'United Kingdom',
        iso: 'GB',
        cities: ['London', 'Manchester', 'Birmingham'],
    },
    { name: 'Canada', iso: 'CA', cities: ['Toronto', 'Vancouver', 'Montreal'] },
    { name: 'Germany', iso: 'DE', cities: ['Berlin', 'Munich', 'Hamburg'] },
    { name: 'France', iso: 'FR', cities: ['Paris', 'Marseille', 'Lyon'] },
    {
        name: 'Australia',
        iso: 'AU',
        cities: ['Sydney', 'Melbourne', 'Brisbane'],
    },
    {
        name: 'Brazil',
        iso: 'BR',
        cities: ['Rio de Janeiro', 'Sao Paulo', 'Brasilia'],
    },
    { name: 'India', iso: 'IN', cities: ['Mumbai', 'Delhi', 'Bangalore'] },
    { name: 'China', iso: 'CN', cities: ['Beijing', 'Shanghai', 'Guangzhou'] },
    { name: 'Japan', iso: 'JP', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkInsert(
                'country',
                countriesData.map((country) => ({
                    name: country.name,
                    ISO: country.iso,
                    created_date: new Date(),
                    updated_date: new Date(),
                })),
                { transaction }
            );

            const countries = await queryInterface.sequelize.query(
                'SELECT id, name from "country";',
                { transaction }
            );

            console.log(
                '---------------------all countries--------------------------',
                countries
            );

            const countryIds = countries[0].map((country) => country.id);

            const cities = countriesData.flatMap((country, index) => {
                const countryId = countryIds[index];
                return country.cities.map((city) => ({
                    name: city,
                    country_id: countryId,
                    created_date: new Date(),
                    updated_date: new Date(),
                }));
            });

            await queryInterface.bulkInsert('city', cities, { transaction });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkDelete('city', null, { transaction });
            await queryInterface.bulkDelete('country', null, { transaction });
        } catch (err) {
            await transaction.commit();
            throw err;
        }
    },
};
