import {
    create,
    getAll,
    getById,
    remove,
    update,
} from '../controllers/mission.controller.js';
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.route('/').post(asyncHandler(getAll));
router.route('/').post(asyncHandler(create));

router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));

router.route('/:id').delete(asyncHandler(remove));

export default router;
