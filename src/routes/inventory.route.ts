'use strict';
import express from 'express';
const router = express.Router();
import inventoryController from '../controllers/inventory.controller';
import { validate, validateIdParam } from '../appConfigs/middleware/validation';

// Item routes with validation
router.get('/items', inventoryController.listItems);
router.post('/items', validate('createItem'), inventoryController.createItem);
router.put('/items/:id', validate('updateItem'), inventoryController.updateItem);

// Stock In routes with validation
router.get('/stock-in', validate('stockInFilters'), inventoryController.listStockIn);
router.get('/stock-in/stats', validate('stockInFilters'), inventoryController.stockTotals);
router.get('/stock-in/mis', validate('stockInFilters'), inventoryController.stockMis);
router.get('/stock-in/earliest', validate('stockInFilters'), inventoryController.earliestTxnDate);
router.post('/stock-in', validate('stockIn'), inventoryController.stockIn);
router.post('/stock-out', validate('stockOut'), inventoryController.stockOut);
router.get('/stock-in/history', validateIdParam, inventoryController.getStockInHistory);
router.get('/transactions', inventoryController.listTransactions);

export default router;