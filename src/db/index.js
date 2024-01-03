import Sequelize from 'sequelize';
import MissionModel from '../models/mission.model.js';
import CityModel from '../models/city.model.js';
import CountryModel from '../models/country.model.js';
import lookupDetailsModel from '../models/lookupDetails.model.js';
import lookupModel from '../models/lookup.model.js';
import skillModel from '../models/skill.model.js';
import themeModel from '../models/theme.model.js';
import MissionSkillModel from '../models/mission_skills.model.js';

const sequelize = new Sequelize(
    process.env.DB,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: process.env.DIALECT,

        // pool: {
        //   max: process.env.POOL_MAX,
        //   min: process.env.POOL_MIN,
        //   acquire: process.env.POOL_ACQUIRE,
        //   idle: process.env.POOLE_IDLE,
        // },
    }
);

const modelDefiners = [
    MissionModel,
    CountryModel,
    CityModel,
    lookupDetailsModel,
    lookupModel,
    themeModel,
    skillModel,
    MissionSkillModel,
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

Object.values(sequelize.models).forEach((model) => {
    if (model.associate) {
        model.associate(sequelize.models);
    }
});

export default sequelize;
