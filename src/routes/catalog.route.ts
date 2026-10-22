'use strict';
import express from 'express'
const router = express.Router();
import catalogController from '../controllers/catalog.controller';


router.get('/categories', catalogController.listCategories);
router.post('/categories', catalogController.createCategory);
router.put('/categories/:id', catalogController.updateCategory);
router.delete('/categories/:id', catalogController.removeCategory);

router.get('/suppliers', catalogController.listSuppliers);
router.post('/suppliers', catalogController.createSupplier);
router.put('/suppliers/:id', catalogController.updateSupplier);
router.delete('/suppliers/:id', catalogController.removeSupplier);


export default router;
