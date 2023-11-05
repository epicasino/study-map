import express from 'express';

const router = express.Router();

import userRoutes from './userRoutes';
import locationRoutes from './locationRoutes';
import reviewRoutes from './reviewRoutes';

router.use('/', userRoutes);
router.use('/locations', locationRoutes);
router.use('/reviews', reviewRoutes);

export default router;
