import express from 'express';
import cors from 'cors';
import missionRouter from './routers/mission.router.js';

const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/missions', missionRouter);

export { app };

// const routes = {
//     missions: missions,
//     // instruments: require('./routes/instruments'),
//     // orchestras: require('./routes/orchestras'),
//     // Add more routes here...
//     // items: require('./routes/items'),
// };

// We provide a root route just as an example
// app.get('/', (req, res) => {
//     res.send(`
// 		<h2>Hello, Sequelize + Express!</h2>
// 		<p>Make sure you have executed <b>npm run setup-example-db</b> once to have a populated example database. Otherwise, you will get <i>'no such table'</i> errors.</p>
// 		<p>Try some routes, such as <a href='/api/users'>/api/users</a> or <a href='/api/orchestras?includeInstruments'>/api/orchestras?includeInstruments</a>!</p>
// 		<p>To experiment with POST/PUT/DELETE requests, use a tool for creating HTTP requests such as <a href='https://github.com/jakubroztocil/httpie#readme'>HTTPie</a>, <a href='https://www.postman.com/downloads/'>Postman</a>, or even <a href='https://en.wikipedia.org/wiki/CURL'>the curl command</a>, or write some JS code for it with <a href='https://github.com/sindresorhus/got#readme'>got</a>, <a href='https://github.com/sindresorhus/ky#readme'>ky</a> or <a href='https://github.com/axios/axios#readme'>axios</a>.</p>
// 	`);
// });

// We define the standard REST APIs for each route (if they exist).
// for (const [routeName, routeController] of Object.entries(routes)) {
//     if (routeController.getAll) {
//         app.get(`/api/${routeName}`, asyncHandler(routeController.getAll));
//     }
//     if (routeController.getById) {
//         app.get(`/api/${routeName}/:id`, asyncHandler(routeController.getById));
//     }
//     if (routeController.create) {
//         app.post(`/api/${routeName}`, asyncHandler(routeController.create));
//     }
//     if (routeController.update) {
//         app.put(`/api/${routeName}/:id`, asyncHandler(routeController.update));
//     }
//     if (routeController.remove) {
//         app.delete(
//             `/api/${routeName}/:id`,
//             asyncHandler(routeController.remove)
//         );
//     }
// }
