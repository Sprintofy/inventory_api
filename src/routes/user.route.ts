'use strict';
import express from 'express'
const router = express.Router();
import userController from '../controllers/user.controller';


router.get('/', userController.list);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);


export default router;
