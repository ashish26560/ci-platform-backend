import sequelize from '../db/index.js';
import { getIdParam } from '../utils/helpers.js';
import { getLookupDetailId } from './common.controller.js';
import { Op } from 'sequelize';

export const getPagination = (page, size) => {
    const limit = size ? +size : 1;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, data: rows, totalPages, currentPage };
};

async function getAll(req, res) {
    const { page, pageSize, search } = req.body;

    const { limit, offset } = getPagination(page, pageSize);

    const searchCriteria = search
        ? {
              [Op.or]: [
                  { name: { [Op.iLike]: `%${search}%` } },
                  //   {
                  //       status: {
                  //           name: { [Op.iLike]: `%${search}%` },
                  //       },
                  //   },
              ],
          }
        : {};

    const data = await sequelize.models.skill.findAndCountAll({
        where: searchCriteria,
        limit,
        offset,
        include: [
            {
                model: sequelize.models.lookup_details,
                as: 'status',
                attributes: ['id', 'code', 'name'],
            },
        ],
    });
    res.status(200).json(getPagingData(data, page, limit));
}

async function getById(req, res) {
    const id = getIdParam(req);
    const skill = await sequelize.models.skill.findByPk(id, {
        attributes: ['id', 'name', 'status_id'],
        include: [
            {
                model: sequelize.models.lookup_details,
                as: 'status',
                attributes: ['id', 'name', 'code'],
            },
        ],
    });
    if (skill) {
        res.status(200).json(skill);
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
        const data = {
            ...req.body,
            status_id: await getLookupDetailId('STATUS', req.body.status),
            created_date: new Date(),
            updated_date: new Date(),
        };
        const result = await sequelize.models.skill.create(data);
        res.status(201).json(result).end();
    }
}

async function update(req, res) {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
        const data = {
            ...req.body,
            status_id: await getLookupDetailId('STATUS', req.body.status),
            updated_date: new Date(),
        };

        await sequelize.models.skill.update(data, {
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
    await sequelize.models.skill.destroy({
        where: {
            id: id,
        },
    });
    res.status(200).end();
}

export { getAll, getById, create, update, remove };
