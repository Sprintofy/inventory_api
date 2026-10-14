'use strict';
import express from 'express'
const router = express.Router();
import departmentController from '../controllers/department.controller';


router.get('/', departmentController.listDepartments);
router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.removeDepartment);

router.get('/subs/all', departmentController.listSubs);
router.post('/subs', departmentController.createSub);
router.put('/subs/:id', departmentController.updateSub);
router.delete('/subs/:id', departmentController.removeSub);


export default router;
