'use strict';
import BaseModel from "./dbConnection/base.model";

class InventoryModel extends BaseModel {
    constructor() {
        super();
    }

    async listItems() {
        return await this._executeQuery("SELECT * FROM inventory_items ORDER BY device_name ASC;", []);
    }

    async findItem(id: string) {
        return await this._executeQuery("SELECT * FROM inventory_items WHERE id = ? LIMIT 1;", [id]);
    }

    async createItem(data: any) {
        return await this._executeQuery("INSERT INTO inventory_items SET ?;", [data]);
    }

    async updateItem(id: string, data: any) {
        return await this._executeQuery("UPDATE inventory_items SET ? WHERE id = ?;", [data, id]);
    }

    async listStockIn() {
        return await this._executeQuery("SELECT * FROM stock_in_records ORDER BY date DESC;", []);
    }

    async createStockIn(data: any) {
        return await this._executeQuery("INSERT INTO stock_in_records SET ?;", [data]);
    }

    async updateStockInStatus(id: string, status: string) {
        return await this._executeQuery("UPDATE stock_in_records SET status = ? WHERE id = ?;", [status, id]);
    }

    async listStockOut() {
        return await this._executeQuery("SELECT * FROM stock_out_records ORDER BY date DESC;", []);
    }

    async createStockOut(data: any) {
        return await this._executeQuery("INSERT INTO stock_out_records SET ?;", [data]);
    }

    async updateStockOutStatus(id: string, status: string) {
        return await this._executeQuery("UPDATE stock_out_records SET status = ? WHERE id = ?;", [status, id]);
    }

    async listTransactions() {
        return await this._executeQuery("SELECT * FROM stock_transactions ORDER BY date DESC;", []);
    }

    async createTransaction(data: any) {
        return await this._executeQuery("INSERT INTO stock_transactions SET ?;", [data]);
    }
}

export default new InventoryModel()
