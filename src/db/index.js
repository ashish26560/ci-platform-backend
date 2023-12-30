import Sequelize from 'sequelize';
import MissionModel from '../models/mission.model.js';

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
    // require('./models/instrument.model'),
    // require('./models/orchestra.model'),
    // Add more models here...
    // require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

export default sequelize;
