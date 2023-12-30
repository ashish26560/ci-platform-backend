import { getAll } from '../controllers/mission.controller.js';
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.route('/').get(asyncHandler(getAll));

export default router;
