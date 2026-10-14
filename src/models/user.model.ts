'use strict';
import BaseModel from "./dbConnection/base.model";

class UserModel extends BaseModel {
    constructor() {
        super();
    }

    async findByEmail(email: string) {
        return await this._executeQuery("SELECT * FROM users WHERE email = ? LIMIT 1;", [email]);
    }

    async findById(id: string) {
        return await this._executeQuery("SELECT * FROM users WHERE id = ? LIMIT 1;", [id]);
    }

    async listAll() {
        return await this._executeQuery("SELECT * FROM users ORDER BY name ASC;", []);
    }

    async createUser(data: any) {
        return await this._executeQuery("INSERT INTO users SET ?;", [data]);
    }

    async updateUser(id: string, data: any) {
        return await this._executeQuery("UPDATE users SET ? WHERE id = ?;", [data, id]);
    }

    async deleteUser(id: string) {
        return await this._executeQuery("DELETE FROM users WHERE id = ?;", [id]);
    }
}

export default new UserModel()
