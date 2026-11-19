'use strict';
import express from 'express';
const router = express.Router();
import technicianController from '../controllers/technician.controller';
import { validate, validateIdParam } from '../appConfigs/middleware/validation';

router.get('/', technicianController.list);
router.post('/', validate('createTechnician'), technicianController.create);
router.put('/:id', validateIdParam, technicianController.update);
router.delete('/:id', validateIdParam, technicianController.remove);

export default router;