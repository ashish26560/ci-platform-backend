import sequelize from '../db/index.js';
import {
    PaginationData,
    StandardResponse,
} from '../responses/StandardResponse.js';
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
    return new PaginationData(totalItems, currentPage, totalPages, rows);
};

async function getAll(req, res) {
    try {
        const { page, pageSize, search } = req.body;
        const { limit, offset } = getPagination(page, pageSize);

        const searchCriteria = search
            ? {
                  [Op.or]: [
                      { name: { [Op.iLike]: `%${search}%` } },
                      { '$status.name$': { [Op.iLike]: `%${search}%` } },
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

        const response = new StandardResponse(
            200,
            getPagingData(data, page, limit)
        );
        res.status(200).json(response);
    } catch (error) {
        const response = new StandardResponse(
            500,
            null,
            'Internal Server Error',
            error.message
        );
        res.status(500).json(response);
    }
}

async function getById(req, res) {
    try {
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
            const response = new StandardResponse(200, skill);
            res.status(200).json(response);
        } else {
            const response = new StandardResponse(404, null, 'Not found');
            res.status(404).json(response);
        }
    } catch (error) {
        const response = new StandardResponse(
            500,
            null,
            'Internal Server Error',
            error.message
        );
        res.status(500).json(response);
    }
}

async function create(req, res) {
    try {
        if (req.body.id) {
            const response = new StandardResponse(
                400,
                null,
                'Bad request: ID should not be provided'
            );
            res.status(400).json(response);
        } else {
            const data = {
                ...req.body,
                status_id: await getLookupDetailId('STATUS', req.body.status),
                created_date: new Date(),
                updated_date: new Date(),
            };
            const result = await sequelize.models.skill.create(data);
            const response = new StandardResponse(201, result);
            res.status(201).json(response);
        }
    } catch (error) {
        const response = new StandardResponse(
            500,
            null,
            'Internal Server Error',
            error.message
        );
        res.status(500).json(response);
    }
}

async function update(req, res) {
    try {
        const id = getIdParam(req);

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

            const response = new StandardResponse(200, null);
            res.status(200).json(response);
        } else {
            const response = new StandardResponse(
                400,
                null,
                `Bad request: param ID (${id}) does not match body ID (${req.body.id})`
            );
            res.status(400).json(response);
        }
    } catch (error) {
        const response = new StandardResponse(
            500,
            null,
            'Internal Server Error',
            error.message
        );
        res.status(500).json(response);
    }
}

async function remove(req, res) {
    try {
        const id = getIdParam(req);
        await sequelize.models.skill.destroy({
            where: {
                id: id,
            },
        });
        const response = new StandardResponse(200, null);
        res.status(200).json(response);
    } catch (error) {
        const response = new StandardResponse(
            500,
            null,
            'Internal Server Error',
            error.message
        );
        res.status(500).json(response);
    }
}

export { getAll, getById, create, update, remove };
