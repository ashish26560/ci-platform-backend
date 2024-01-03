import sequelize from '../db/index.js';

async function getAllCountries(req, res) {
    const countries = await sequelize.models.country.findAll();
    res.status(200).json(countries);
}

async function getAllCities(req, res) {
    const Cities = await sequelize.models.city.findAll();
    res.status(200).json(Cities);
}

async function getAllAvailabilities(req, res) {
    let data = await sequelize.models.lookup.findAll({
        attributes: { exclude: ['created_date', 'updated_date'] },
        where: { code: 'AVAILABILITY' },
        include: [
            {
                model: sequelize.models.lookup_details,
                attributes: ['name', 'code', 'id'],
                as: 'lookup_details',
            },
        ],
    });
    data = JSON.parse(JSON.stringify(data));

    res.status(200).json(data[0].lookup_details);
}

async function getThemeStatus(req, res) {
    let data = await sequelize.models.lookup.findAll({
        attributes: { exclude: ['created_date', 'updated_date'] },
        where: { code: 'STATUS' },
        include: [
            {
                model: sequelize.models.lookup_details,
                attributes: ['name', 'code', 'id'],
                as: 'lookup_details',
            },
        ],
    });
    data = JSON.parse(JSON.stringify(data));

    res.status(200).json(data[0].lookup_details);
}

async function getCountriesWithCity(req, res) {
    const Cities = await sequelize.models.city.findAll({
        include: [
            {
                model: sequelize.models.country,
                attributes: ['ISO'],
                as: 'country', // This alias should match the 'as' value in your association definition
            },
        ],
    });

    res.status(200).json(Cities);
}

export {
    getAllCountries,
    getAllCities,
    getCountriesWithCity,
    getAllAvailabilities,
    getThemeStatus,
};

export const getLookupDetailId = async (lookupCode, lookupDetailCode) => {
    let lookupDetailId = await sequelize.models.lookup_details.findOne({
        attributes: ['id'],
        where: { code: lookupDetailCode },
        include: [
            {
                model: sequelize.models.lookup,
                attributes: [],
                as: 'lookup',
                where: { code: lookupCode },
            },
        ],
    });
    lookupDetailId = JSON.parse(JSON.stringify(lookupDetailId)).id;

    return lookupDetailId;
};
