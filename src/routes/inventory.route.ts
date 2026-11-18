'use strict';
import express from 'express'
const router = express.Router();
import inventoryController from '../controllers/inventory.controller';


router.get('/items', inventoryController.listItems);
router.post('/items', inventoryController.createItem);
router.put('/items/:id', inventoryController.updateItem);

router.get('/stock-in', inventoryController.listStockIn);
router.get('/stock-in/stats', inventoryController.stockTotals);
router.post('/stock-in', inventoryController.stockIn);
router.post('/stock-out', inventoryController.stockOut);
router.get('/stock-in/history', inventoryController.getStockInHistory);
router.get('/transactions', inventoryController.listTransactions);


export default router;
