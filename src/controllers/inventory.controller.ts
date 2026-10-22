'use strict';
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../appConfigs/utilities/apiResponse';
import IController from '../appConfigs/utilities/IController';
import MESSAGES from '../common/messages/messages';
import inventoryService from '../services/inventory.service';
const LOGGER = new (require('../appConfigs/utilities/logger').default)('inventoryController.ts');

const fail = (res: any, error: any) => {
    if (error instanceof Error) {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, error.message, null);
    } else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, MESSAGES.COMMON.SOMETHING_WRONG, null)
    }
};

const run = (fn: any): IController => async (req: any, res: any) => {
    try {
        const results = await fn(req);
        apiResponse.success(res, httpStatusCodes.OK, MESSAGES.COMMON.SUCCESS.FETCH, results);
    } catch (error: any) {
        fail(res, error);
    }
};

export default {
    listItems: run(inventoryService.listItems),
    createItem: run(inventoryService.createItem),
    updateItem: run(inventoryService.updateItem),
    stockIn: run(inventoryService.stockIn),
    stockOut: run(inventoryService.stockOut),
    listStockIn: run(inventoryService.listStockIn),
    listStockOut: run(inventoryService.listStockOut),
    listTransactions: run(inventoryService.listTransactions),
    setStockInStatus: run(inventoryService.setStockInStatus),
    setStockOutStatus: run(inventoryService.setStockOutStatus),
}
