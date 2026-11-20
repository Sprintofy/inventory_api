'use strict';
import BaseModel from "./dbConnection/base.model";

class SystemModel extends BaseModel {
    constructor() {
        super();
    }

    async listActivities() {
        return await this._executeQuery("SELECT * FROM activities ORDER BY date DESC LIMIT 500;", []);
    }

    async createActivity(data: any) {
        return await this._executeQuery("INSERT INTO activities SET ?;", [data]);
    }
}

export default new SystemModel()
