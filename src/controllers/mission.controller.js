import sequelize from '../db/index.js';
import { getIdParam } from '../utils/helpers.js';

async function getAll(req, res) {
    const users = await sequelize.models.mission.findAll();
    res.status(200).json(users);
}

async function getById(req, res) {
    const id = getIdParam(req);
    const mission = await sequelize.models.mission.findByPk(id);
    if (mission) {
        res.status(200).json(mission);
    } else {
        res.status(404).send('404 - Not found');
    }
}

async function create(req, res) {
    if (req.body.id) {
        res.status(400).send(
            `Bad request: ID should not be provided, since it is determined automatically by the database.`
        );
    } else {
        await sequelize.models.mission.create(req.body);
        res.status(201).end();
    }
}

async function update(req, res) {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
        await sequelize.models.mission.update(req.body, {
            where: {
                id: id,
            },
        });
        res.status(200).end();
    } else {
        res.status(400).send(
            `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
        );
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    await sequelize.models.mission.destroy({
        where: {
            id: id,
        },
    });
    res.status(200).end();
}

export { getAll, getById, create, update, remove };
