'use strict';
import express from 'express'
const router = express.Router();
import operationsController from '../controllers/operations.controller';
import systemController from '../controllers/system.controller';


router.get('/transfers', operationsController.listTransfers);
router.post('/transfers', operationsController.createTransfer);
router.put('/transfers/:id', operationsController.updateTransfer);

router.get('/requests', operationsController.listRequests);
router.post('/requests', operationsController.createRequest);
router.put('/requests/:id', operationsController.updateRequest);

router.get('/bootstrap', systemController.bootstrap);
router.get('/activities', systemController.listActivities);
router.post('/activities', systemController.createActivity);

router.get('/notifications', systemController.listNotifications);
router.put('/notifications/read', systemController.markNotificationsRead);


export default router;
