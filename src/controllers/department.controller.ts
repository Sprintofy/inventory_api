'use strict';
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../appConfigs/utilities/apiResponse';
import IController from '../appConfigs/utilities/IController';
import MESSAGES from '../common/messages/messages';
import departmentService from '../services/department.service';
const LOGGER = new (require('../appConfigs/utilities/logger').default)('departmentsController.ts');

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
    listDepartments: run(departmentService.listDepartments),
    createDepartment: run(departmentService.createDepartment),
    updateDepartment: run(departmentService.updateDepartment),
    removeDepartment: run(departmentService.removeDepartment),
    listSubs: run(departmentService.listSubs),
    createSub: run(departmentService.createSub),
    updateSub: run(departmentService.updateSub),
    removeSub: run(departmentService.removeSub),
}
