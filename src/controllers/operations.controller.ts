'use strict';
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../appConfigs/utilities/apiResponse';
import IController from '../appConfigs/utilities/IController';
import MESSAGES from '../common/messages/messages';
import operationsService from '../services/operations.service';
const LOGGER = new (require('../appConfigs/utilities/logger').default)('operationsController.ts');

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
    listTransfers: run(operationsService.listTransfers),
    createTransfer: run(operationsService.createTransfer),
    updateTransfer: run(operationsService.updateTransfer),
    listRequests: run(operationsService.listRequests),
    createRequest: run(operationsService.createRequest),
    updateRequest: run(operationsService.updateRequest),
};
