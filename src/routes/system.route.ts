'use strict';
import express from 'express';
const router = express.Router();
import systemController from '../controllers/system.controller';

router.get('/bootstrap', systemController.bootstrap);
router.get('/activities', systemController.listActivities);
router.post('/activities', systemController.createActivity);

export default router;