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

    async listStockIn(filters: any = {}) {
        const { dateFrom, dateTo, status, supplier, search } = filters;
        let sql = "SELECT * FROM stock_in_records WHERE 1=1";
        const params: any[] = [];
        if (dateFrom) {
            sql += " AND date >= ?";
            params.push(dateFrom);
        }
        if (dateTo) {
            sql += " AND date <= ?";
            params.push(dateTo + " 23:59:59");
        }
        if (status && status !== "all") {
            sql += " AND status = ?";
            params.push(status);
        }
        if (supplier && supplier !== "all") {
            sql += " AND supplier = ?";
            params.push(supplier);
        }
        if (search) {
            sql += " AND (item_name LIKE ? OR reference LIKE ? OR supplier LIKE ? OR created_by LIKE ?)";
            const like = `%${search}%`;
            params.push(like, like, like, like);
        }
        sql += " ORDER BY date ASC";
        return await this._executeQuery(sql, params);
    }

    async createStockIn(data: any) {
        return await this._executeQuery("INSERT INTO stock_in_records SET ?;", [data]);
    }

    async updateStockInStatus(id: string, status: string) {
        return await this._executeQuery("UPDATE stock_in_records SET status = ? WHERE id = ?;", [status, id]);
    }

    async listStockOut(filters: any = {}) {
        const { dateFrom, dateTo, status, search } = filters;
        let sql = "SELECT * FROM stock_out_records WHERE 1=1";
        const params: any[] = [];
        if (dateFrom) {
            sql += " AND date >= ?";
            params.push(dateFrom);
        }
        if (dateTo) {
            sql += " AND date <= ?";
            params.push(dateTo + " 23:59:59");
        }
        if (status && status !== "all") {
            sql += " AND status = ?";
            params.push(status);
        }
        if (search) {
            sql += " AND (item_name LIKE ? OR reference LIKE ? OR purpose LIKE ?)";
            const like = `%${search}%`;
            params.push(like, like, like);
        }
        sql += " ORDER BY date ASC";
        return await this._executeQuery(sql, params);
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

    async getStockInHistory(itemId: string) {
        return await this._executeQuery("SELECT * FROM stock_in_records WHERE item_id = ? ORDER BY date DESC;", [itemId]);
    }

    async getStockOutHistory(itemId: string) {
        return await this._executeQuery("SELECT * FROM stock_out_records WHERE item_id = ? ORDER BY date DESC;", [itemId]);
    }

    async findDepartmentByName(name: string) {
        return await this._executeQuery("SELECT * FROM departments WHERE name = ? LIMIT 1;", [name]);
    }

    async getLatestStockInByItemId(itemId: string) {
        return await this._executeQuery("SELECT * FROM stock_in_records WHERE item_id = ? ORDER BY date DESC LIMIT 1;", [itemId]);
    }

    async getStockInByDepartmentAndDate(deptCode: string, date: string) {
        return await this._executeQuery(
            "SELECT * FROM stock_in_records WHERE id LIKE ? AND date = ? ORDER BY id ASC;",
            [`NDA/${deptCode}/${date.slice(2, 4)}/%`, date]
        );
    }
}

export default new InventoryModel()
