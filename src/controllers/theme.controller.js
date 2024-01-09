import { Op } from 'sequelize';
import sequelize from '../db/index.js';
import { getIdParam } from '../utils/helpers.js';
import { getLookupDetailId } from './common.controller.js';
import { getPagination, getPagingData } from './skill.controller.js';

async function getAll(req, res) {
    try {
        const { page, pageSize, search } = req.body;
        const { limit, offset } = getPagination(page, pageSize);

        const searchCriteria = search
            ? {
                  [Op.or]: [
                      { name: { [Op.iLike]: `%${search}%` } },
                      // { '$status.name$': { [Op.iLike]: `%${search}%` } },
                  ],
              }
            : {};

        const data = await sequelize.models.theme.findAndCountAll({
            where: searchCriteria,
            limit,
            offset,
            include: [
                {
                    model: sequelize.models.lookup_details,
                    as: 'status',
                    attributes: ['id', 'code', 'name'],
                    // where: { name: { [Op.iLike]: `%${search}%` } },
                },
            ],
        });

        res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
        console.error('Error getting themes:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getById(req, res) {
    try {
        const id = getIdParam(req);
        const theme = await sequelize.models.theme.findByPk(id, {
            attributes: ['id', 'name', 'status_id'],
            include: [
                {
                    model: sequelize.models.lookup_details,
                    as: 'status',
                    attributes: ['id', 'name', 'code'],
                },
            ],
        });

        if (theme) {
            res.status(200).json(theme);
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        console.error('Error getting theme by ID:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function create(req, res) {
    try {
        if (req.body.id) {
            return res
                .status(400)
                .send(
                    `Bad request: ID should not be provided, since it is determined automatically by the database.`
                );
        }

        const data = {
            ...req.body,
            status_id: await getLookupDetailId('STATUS', req.body.status.code),
            created_date: new Date(),
            updated_date: new Date(),
        };

        const result = await sequelize.models.theme.create(data);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating theme:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function update(req, res) {
    try {
        const id = getIdParam(req);

        // Validate if the ID in the path matches the ID in the request body
        if (req.body.id !== id) {
            return res
                .status(400)
                .send(
                    `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
                );
        }

        // Prepare data for update
        const data = {
            ...req.body,
            status_id: await getLookupDetailId('STATUS', req.body.status.code),
            updated_date: new Date(),
        };

        // Perform the update
        const [rowCount] = await sequelize.models.theme.update(data, {
            where: { id: id },
        });

        if (rowCount === 1) {
            // Fetch the updated object with associated fields
            const updatedTheme = await sequelize.models.theme.findByPk(id, {
                attributes: ['id', 'name', 'status_id'],
                include: [
                    {
                        model: sequelize.models.lookup_details,
                        as: 'status',
                        attributes: ['id', 'name', 'code'],
                    },
                ],
            });

            // Send the updated object with associated fields in the response
            res.status(200).json(updatedTheme);
        } else {
            res.status(404).send(`Object not found with ID: ${id}`);
        }
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function remove(req, res) {
    try {
        const id = getIdParam(req);
        const result = await sequelize.models.theme.destroy({
            where: {
                id: id,
            },
        });
        res.status(200).json(result).end();
    } catch (error) {
        console.error('Error removing theme:', error);
        res.status(500).send('Internal Server Error');
    }
}

export { getAll, getById, create, update, remove };
