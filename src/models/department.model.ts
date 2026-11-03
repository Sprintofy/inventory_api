'use strict';
import BaseModel from "./dbConnection/base.model";

class DepartmentModel extends BaseModel {
    constructor() {
        super();
    }

    async listDepartments() {
        return await this._executeQuery("SELECT * FROM departments ORDER BY name ASC;", []);
    }

    async createDepartment(data: any) {
        return await this._executeQuery("INSERT INTO departments SET ?;", [data]);
    }

    async updateDepartment(id: string, data: any) {
        return await this._executeQuery("UPDATE departments SET ? WHERE id = ?;", [data, id]);
    }

    async deleteDepartment(id: string) {
        return await this._executeQuery("DELETE FROM departments WHERE id = ?;", [id]);
    }
}

export default new DepartmentModel()
