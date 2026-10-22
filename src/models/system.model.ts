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

    async listNotifications() {
        return await this._executeQuery("SELECT * FROM notifications ORDER BY date DESC LIMIT 100;", []);
    }

    async markNotificationsRead() {
        return await this._executeQuery("UPDATE notifications SET is_read = 1;", []);
    }
}

export default new SystemModel()
