'use strict';
import express from 'express';
const router = express.Router();
import departmentController from '../controllers/department.controller';
import { validate, validateIdParam } from '../appConfigs/middleware/validation';

router.get('/', departmentController.listDepartments);
router.post('/', validate('createDepartment'), departmentController.createDepartment);
router.put('/:id', validateIdParam, departmentController.updateDepartment);
router.delete('/:id', validateIdParam, departmentController.removeDepartment);

export default router;