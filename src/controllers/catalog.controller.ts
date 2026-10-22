'use strict';
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../appConfigs/utilities/apiResponse';
import IController from '../appConfigs/utilities/IController';
import MESSAGES from '../common/messages/messages';
import catalogService from '../services/catalog.service';
const LOGGER = new (require('../appConfigs/utilities/logger').default)('catalogController.ts');

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
    listCategories: run(catalogService.listCategories),
    createCategory: run(catalogService.createCategory),
    updateCategory: run(catalogService.updateCategory),
    removeCategory: run(catalogService.removeCategory),
    listSuppliers: run(catalogService.listSuppliers),
    createSupplier: run(catalogService.createSupplier),
    updateSupplier: run(catalogService.updateSupplier),
    removeSupplier: run(catalogService.removeSupplier),
}
