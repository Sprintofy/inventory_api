'use strict';
import express from 'express';
const router = express.Router();
import catalogController from '../controllers/catalog.controller';
import { validate, validateIdParam } from '../appConfigs/middleware/validation';

router.get('/categories', catalogController.listCategories);
router.post('/categories', validate('createCategory'), catalogController.createCategory);
router.put('/categories/:id', validate('updateCategory'), catalogController.updateCategory);
router.delete('/categories/:id', validateIdParam, catalogController.removeCategory);

export default router;