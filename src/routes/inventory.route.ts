'use strict';
import express from 'express'
const router = express.Router();
import inventoryController from '../controllers/inventory.controller';


router.get('/items', inventoryController.listItems);
router.post('/items', inventoryController.createItem);
router.put('/items/:id', inventoryController.updateItem);

router.get('/stock-in', inventoryController.listStockIn);
router.post('/stock-in', inventoryController.stockIn);
router.put('/stock-in/:id/status', inventoryController.setStockInStatus);
router.get('/stock-in/history', inventoryController.getStockInHistory);

router.get('/stock-out', inventoryController.listStockOut);
router.post('/stock-out', inventoryController.stockOut);
router.put('/stock-out/:id/status', inventoryController.setStockOutStatus);
router.get('/stock-out/history', inventoryController.getStockOutHistory);

router.get('/transactions', inventoryController.listTransactions);


export default router;
