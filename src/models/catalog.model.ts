'use strict';
import BaseModel from "./dbConnection/base.model";

class CatalogModel extends BaseModel {
    constructor() {
        super();
    }

    async listCategories() {
        return await this._executeQuery("SELECT * FROM categories ORDER BY name ASC;", []);
    }

    async createCategory(data: any) {
        return await this._executeQuery("INSERT INTO categories SET ?;", [data]);
    }

    async updateCategory(id: string, data: any) {
        return await this._executeQuery("UPDATE categories SET ? WHERE id = ?;", [data, id]);
    }

    async deleteCategory(id: string) {
        return await this._executeQuery("DELETE FROM categories WHERE id = ?;", [id]);
    }
}

export default new CatalogModel()
