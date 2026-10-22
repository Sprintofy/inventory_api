'use strict';
import BaseModel from "./dbConnection/base.model";

class OperationsModel extends BaseModel {
    constructor() {
        super();
    }

    async listTransfers() {
        return await this._executeQuery("SELECT * FROM transfers ORDER BY date DESC;", []);
    }

    async createTransfer(data: any) {
        return await this._executeQuery("INSERT INTO transfers SET ?;", [data]);
    }

    async updateTransfer(id: string, data: any) {
        return await this._executeQuery("UPDATE transfers SET ? WHERE id = ?;", [data, id]);
    }

    async listRequests() {
        return await this._executeQuery("SELECT * FROM requests ORDER BY date DESC;", []);
    }

    async createRequest(data: any) {
        return await this._executeQuery("INSERT INTO requests SET ?;", [data]);
    }

    async updateRequest(id: string, data: any) {
        return await this._executeQuery("UPDATE requests SET ? WHERE id = ?;", [data, id]);
    }
}

export default new OperationsModel()
