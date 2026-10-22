'use strict';
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../appConfigs/utilities/apiResponse';
import IController from '../appConfigs/utilities/IController';
import MESSAGES from '../common/messages/messages';
import ticketService from '../services/ticket.service';
const LOGGER = new (require('../appConfigs/utilities/logger').default)('ticketsController.ts');

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
    list: run(ticketService.list),
    create: run(ticketService.create),
    patch: run(ticketService.patch),
    addIssue: run(ticketService.addIssue),
    updateIssue: run(ticketService.updateIssue),
    removeIssue: run(ticketService.removeIssue),
    close: run(ticketService.close),
    reissue: run(ticketService.reissue),
    assign: run(ticketService.assign),
    remark: run(ticketService.remark),
    submitSolution: run(ticketService.submitSolution),
}
