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

    async findItemBySku(sku: string) {
        return await this._executeQuery("SELECT * FROM inventory_items WHERE sku = ? LIMIT 1;", [sku]);
    }

    async createItem(data: any) {
        return await this._executeQuery("INSERT INTO inventory_items SET ?;", [data]);
    }

    async updateItem(id: string, data: any) {
        return await this._executeQuery("UPDATE inventory_items SET ? WHERE id = ?;", [data, id]);
    }

    async listStockIn(filters: any = {}) {
        const { dateFrom, dateTo, status, search } = filters;
        let sql = "SELECT * FROM stock_in_records WHERE 1=1";
        const params: any[] = [];
        if (dateFrom) {
            sql += " AND date_in >= ?";
            params.push(dateFrom);
        }
        if (dateTo) {
            sql += " AND date_in <= ?";
            params.push(dateTo + " 23:59:59");
        }
        if (status && status !== "all") {
            sql += " AND status = ?";
            params.push(status);
        }
        if (search) {
            sql += " AND (item_name LIKE ? OR work_order_id LIKE ? OR job_no LIKE ? OR department LIKE ?)";
            const like = `%${search}%`;
            params.push(like, like, like, like);
        }
        sql += " ORDER BY date_in DESC";
        return await this._executeQuery(sql, params);
    }

    async stockTotals(filters: any = {}) {
        const { dateFrom, dateTo, department } = filters;
        const params: any[] = [];
        let sql =
            "SELECT " +
            "COALESCE(SUM(CASE WHEN type = 'stock-in' THEN quantity ELSE 0 END), 0) AS total_in, " +
            "COALESCE(SUM(CASE WHEN type = 'stock-out' THEN ABS(quantity) ELSE 0 END), 0) AS total_out " +
            "FROM stock_transactions WHERE 1=1";
        if (dateFrom) {
            sql += " AND date >= ?";
            params.push(dateFrom);
        }
        if (dateTo) {
            sql += " AND date <= ?";
            params.push(dateTo + " 23:59:59");
        }
        if (department && department !== "all") {
            sql += " AND department = ?";
            params.push(department);
        }
        const rows: any = await this._executeQuery(sql, params);
        return {
            totalIn: Number(rows[0]?.total_in || 0),
            totalOut: Number(rows[0]?.total_out || 0),
        };
    }

    async getStockInById(id: any) {
        return await this._executeQuery("SELECT * FROM stock_in_records WHERE id = ? LIMIT 1;", [id]);
    }

    async createStockIn(data: any) {
        return await this._executeQuery("INSERT INTO stock_in_records SET ?;", [data]);
    }

    async updateStockIn(id: any, data: any) {
        return await this._executeQuery("UPDATE stock_in_records SET ? WHERE id = ?;", [data, id]);
    }

    async getStockInHistory(itemId: any) {
        return await this._executeQuery("SELECT * FROM stock_in_records WHERE item_id = ? ORDER BY date_in DESC;", [itemId]);
    }

    async stockOut(id: any, remarks: any, technicianName: any, secIcName: any) {
        return await this._executeQuery(
            "UPDATE stock_in_records SET date_out = NOW(), remarks = ?, technician_name = ?, sec_ic_name = ?, status = 'Stock Out' WHERE id = ?;",
            [remarks, technicianName, secIcName, id],
        );
    }

    async listTransactions() {
        return await this._executeQuery("SELECT * FROM stock_transactions ORDER BY date DESC;", []);
    }

    async createTransaction(data: any) {
        return await this._executeQuery("INSERT INTO stock_transactions SET ?;", [data]);
    }

    async findDepartmentByName(name: string) {
        return await this._executeQuery("SELECT * FROM departments WHERE name = ? LIMIT 1;", [name]);
    }
}

export default new InventoryModel()
