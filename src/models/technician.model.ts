'use strict';
import BaseModel from "./dbConnection/base.model";

class TechnicianModel extends BaseModel {
    constructor() {
        super();
    }

    async findByEmail(email: string) {
        return await this._executeQuery("SELECT * FROM technicians WHERE email = ? LIMIT 1;", [email]);
    }

    async findById(id: string) {
        return await this._executeQuery("SELECT * FROM technicians WHERE id = ? LIMIT 1;", [id]);
    }

    async listAll() {
        return await this._executeQuery("SELECT * FROM technicians ORDER BY name ASC;", []);
    }

    async createTechnician(data: any) {
        return await this._executeQuery("INSERT INTO technicians SET ?;", [data]);
    }

    async updateTechnician(id: string, data: any) {
        return await this._executeQuery("UPDATE technicians SET ? WHERE id = ?;", [data, id]);
    }

    async deleteTechnician(id: string) {
        return await this._executeQuery("DELETE FROM technicians WHERE id = ?;", [id]);
    }
}

export default new TechnicianModel()
