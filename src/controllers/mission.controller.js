import sequelize from '../db/index.js';
import { getIdParam } from '../utils/helpers.js';
import { getLookupDetailId } from './common.controller.js';

async function getAll(req, res) {
    try {
        const missions = await sequelize.models.mission.findAll({
            attributes: { exclude: ['created_date', 'updated_date'] },
            include: [
                {
                    model: sequelize.models.mission_skills,
                    as: 'mission_skills',
                    include: [
                        {
                            model: sequelize.models.skill,
                            as: 'skill',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
                {
                    model: sequelize.models.theme,
                    as: 'theme',
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!missions) {
            res.status(404).send('404 - Not found');
            return;
        }

        const result = missions.map((mission) => {
            const missionSkills = mission.mission_skills.map(
                ({ skill }) => skill
            );

            const missionData = mission.toJSON();

            return {
                ...missionData,
                mission_skills: missionSkills,
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const mission = await sequelize.models.mission.findByPk(id, {
            attributes: { exclude: ['created_date', 'updated_date'] },
            include: [
                {
                    model: sequelize.models.mission_skills,
                    as: 'mission_skills',
                    include: [
                        {
                            model: sequelize.models.skill,
                            as: 'skill',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
                {
                    model: sequelize.models.theme,
                    as: 'theme',
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!mission) {
            res.status(404).send('404 - Not found');
            return;
        }

        const missionSkills = mission.mission_skills.map(({ skill }) => skill);

        const missionData = mission.toJSON();

        res.status(200).json({
            ...missionData,
            mission_skills: missionSkills,
        });
    } catch (error) {
        console.error('Error fetching mission by ID:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function create(req, res) {
    if (req.body.id) {
        res.status(400).send(
            `Bad request: ID should not be provided, since it is determined automatically by the database.`
        );
    } else {
        const transaction = await sequelize.transaction();
        try {
            const isMissionTypeGoal = req.body.mission_type_code === 'GOAL';
            const createdMission = await sequelize.models.mission.create(
                {
                    ...req.body,
                    total_seats: isMissionTypeGoal
                        ? req.body.total_seats
                        : null,
                    seats_left: isMissionTypeGoal ? req.body.seats_left : null,
                    mission_type_id: await getLookupDetailId(
                        'MISSION_TYPE',
                        req.body.mission_type_code
                    ),
                    availability_id: await getLookupDetailId(
                        'AVAILABILITY',
                        req.body.availability_code
                    ),
                    created_date: new Date(),
                    updated_date: new Date(),
                    start_date: isMissionTypeGoal ? null : req.body.start_date,
                    end_date: isMissionTypeGoal ? null : req.body.end_date,
                    deadline: isMissionTypeGoal ? null : req.body.deadline,
                },
                { transaction }
            );
            const missionId = createdMission.id;

            const skillIds = req.body.skill_ids;
            const missionSkillEntries = skillIds.map((skillId) => ({
                skill_id: skillId,
                mission_id: missionId,
                created_date: new Date(),
                updated_date: new Date(),
            }));
            await sequelize.models.mission_skills.bulkCreate(
                missionSkillEntries,
                { transaction }
            );
            await transaction.commit();
            res.status(201)
                .json({
                    mission: createdMission.toJSON(),
                    mission_skills: missionSkillEntries,
                })
                .end();
        } catch (err) {
            await transaction.rollback();
            res.status(500).send('Internal Server Error');
        }
    }
}

async function update(req, res) {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
        const isMissionTypeGoal = req.body.mission_type_code === 'GOAL';
        const createdMission = await sequelize.models.mission.update(
            {
                ...req.body,
                total_seats: isMissionTypeGoal ? req.body.total_seats : null,
                seats_left: isMissionTypeGoal ? req.body.seats_left : null,
                mission_type_id: await getLookupDetailId(
                    'MISSION_TYPE',
                    req.body.mission_type_code
                ),
                availability_id: await getLookupDetailId(
                    'AVAILABILITY',
                    req.body.availability_code
                ),
                created_date: new Date(),
                updated_date: new Date(),
                start_date: isMissionTypeGoal ? null : req.body.start_date,
                end_date: isMissionTypeGoal ? null : req.body.end_date,
                deadline: isMissionTypeGoal ? null : req.body.deadline,
            },
            {
                where: {
                    id: id,
                },
            },
            { transaction }
        );
        // const missionId = createdMission.id;
        // TODO: Add check if skill don't exist then only add it
        const skillIds = req.body.skill_ids;
        const missionSkillEntries = skillIds.map((skillId) => ({
            skill_id: skillId,
            mission_id: id,
            created_date: new Date(),
            updated_date: new Date(),
        }));
        await sequelize.models.mission_skills.bulkCreate(missionSkillEntries, {
            transaction,
        });
        await transaction.commit();
        res.status(201)
            .json({
                mission: createdMission.toJSON(),
                mission_skills: missionSkillEntries,
            })
            .end();

        await sequelize.models.mission.update(req.body, {
            where: {
                id: id,
            },
        });
        try {
        } catch (err) {
            await transaction.rollback();
            res.status(500).send('Internal Server Error');
        }
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
