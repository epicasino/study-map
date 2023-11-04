import express from 'express';

const router = express.Router();

import userRoutes from './userRoutes';
import locationRoutes from './locations';

router.use('/', userRoutes);
router.use('/locations', locationRoutes);

export default router;
