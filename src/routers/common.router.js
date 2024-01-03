import { Router } from 'express';
import {
    getAllCities,
    getAllCountries,
    getThemeStatus,
    getAllAvailabilities,
} from '../controllers/common.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.route('/countries').get(asyncHandler(getAllCountries));
router.route('/cities').get(asyncHandler(getAllCities));
router.route('/availabilities').get(asyncHandler(getAllAvailabilities));
router.route('/theme-status').get(asyncHandler(getThemeStatus));

export default router;
