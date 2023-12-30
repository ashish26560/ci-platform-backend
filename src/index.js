import 'dotenv/config';
import sequelize from './db/index.js';
import { app } from './app.js';

// set port, listen for requests
const PORT = process.env.PORT || 8000;

async function assertDatabaseConnectionOk() {
    console.log('Checking database connection...');
    try {
        // await sequelize.sync({ force: true });
        await sequelize.authenticate();
        console.log('Database connection OK!');
        app.listen(PORT, () => {
            console.log(
                `Express server started on port ${PORT}. Try some routes, such as '/api/users'.`
            );
        });
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

async function init() {
    await assertDatabaseConnectionOk();

    console.log(`Starting Sequelize + Express example on port ${PORT}...`);
}

init();

// db.sequelize
//   .sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });
