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

    async findOpenStockInToday(itemId: string) {
        return await this._executeQuery(
            "SELECT id, job_no FROM stock_in_records WHERE item_id = ? AND DATE(date_in) = CURDATE() AND date_out IS NULL AND status NOT IN ('Stock Out', 'Sent', 'cancelled') ORDER BY date_in DESC LIMIT 1;",
            [itemId],
        );
    }

    async createItem(data: any) {
        return await this._executeQuery("INSERT INTO inventory_items SET ?;", [data]);
    }

    async updateItem(id: string, data: any) {
        return await this._executeQuery("UPDATE inventory_items SET ? WHERE id = ?;", [data, id]);
    }

    async listStockIn(filters: any = {}) {
        const { dateFrom, dateTo, status, search, type, maintenanceType, category, department } = filters;
        let sql =
            "SELECT s.* FROM stock_in_records s " +
            "LEFT JOIN inventory_items i ON i.id = s.item_id WHERE 1=1";
        const params: any[] = [];
        if (dateFrom) {
            sql += " AND s.date_in >= ?";
            params.push(dateFrom);
        }
        if (dateTo) {
            sql += " AND s.date_in <= ?";
            params.push(dateTo + " 23:59:59");
        }
        if (status && status !== "all") {
            sql += " AND s.status = ?";
            params.push(status);
        }
        if (type && type !== "all") {
            sql += " AND i.type = ?";
            params.push(type);
        }
        if (maintenanceType && maintenanceType !== "all") {
            sql += " AND i.maintenance_type = ?";
            params.push(maintenanceType);
        }
        if (category && category !== "all") {
            sql += " AND i.category = ?";
            params.push(category);
        }
        if (department && department !== "all") {
            sql += " AND s.department = ?";
            params.push(department);
        }
        if (search) {
            sql += " AND (s.item_name LIKE ? OR s.work_order_id LIKE ? OR s.job_no LIKE ? OR s.department LIKE ?)";
            const like = `%${search}%`;
            params.push(like, like, like, like);
        }
        sql += " ORDER BY s.date_in DESC";
        return await this._executeQuery(sql, params);
    }

    async stockTotals(filters: any = {}) {
        const { dateFrom, dateTo, department, type, maintenanceType, category } = filters;
        const params: any[] = [];
        let sql =
            "SELECT " +
            "COALESCE(SUM(CASE WHEN t.type = 'stock-in' THEN t.quantity ELSE 0 END), 0) AS total_in, " +
            "COALESCE(SUM(CASE WHEN t.type = 'stock-out' THEN ABS(t.quantity) ELSE 0 END), 0) AS total_out " +
            "FROM stock_transactions t " +
            "LEFT JOIN inventory_items i ON i.id = t.item_id WHERE 1=1";
        if (dateFrom) {
            sql += " AND t.date >= ?";
            params.push(dateFrom);
        }
        if (dateTo) {
            sql += " AND t.date <= ?";
            params.push(dateTo + " 23:59:59");
        }
        if (department && department !== "all") {
            sql += " AND t.department = ?";
            params.push(department);
        }
        if (type && type !== "all") {
            sql += " AND i.type = ?";
            params.push(type);
        }
        if (maintenanceType && maintenanceType !== "all") {
            sql += " AND i.maintenance_type = ?";
            params.push(maintenanceType);
        }
        if (category && category !== "all") {
            sql += " AND i.category = ?";
            params.push(category);
        }
        const rows: any = await this._executeQuery(sql, params);
        return {
            totalIn: Number(rows[0]?.total_in || 0),
            totalOut: Number(rows[0]?.total_out || 0),
        };
    }

    async stockMis(filters: any = {}) {
        const { dateFrom, dateTo, department } = filters;
        const params: any[] = [];
        let bffSql =
            "SUM(CASE WHEN type = 'stock-in' THEN quantity ELSE -quantity END) AS bff";
        if (dateFrom) {
            bffSql =
                "SUM(CASE WHEN date < ? THEN CASE WHEN type = 'stock-in' THEN quantity ELSE -quantity END ELSE 0 END) AS bff";
            params.push(dateFrom + " 00:00:00");
        }
        const fromParam = dateFrom ? dateFrom + " 00:00:00" : "1970-01-01 00:00:00";
        const toParam = dateTo ? dateTo + " 23:59:59" : "2099-12-31 23:59:59";
        params.push(fromParam, toParam, fromParam, toParam);

        let sql =
            "SELECT category, " +
            bffSql +
            ", COALESCE(SUM(CASE WHEN type = 'stock-in' AND date >= ? AND date <= ? THEN quantity ELSE 0 END), 0) AS in_qty" +
            ", COALESCE(SUM(CASE WHEN type = 'stock-out' AND date >= ? AND date <= ? THEN ABS(quantity) ELSE 0 END), 0) AS out_qty" +
            " FROM stock_transactions WHERE 1=1";
        if (department && department !== "all") {
            sql += " AND department = ?";
            params.push(department);
        }
        sql += " GROUP BY category";
        return await this._executeQuery(sql, params);
    }

    async earliestTransactionDate(department?: string) {
        const params: any[] = [];
        let sql = "SELECT DATE(MIN(date)) AS earliest FROM stock_transactions WHERE 1=1";
        if (department && department !== "all") {
            sql += " AND department = ?";
            params.push(department);
        }
        const rows: any = await this._executeQuery(sql, params);
        return rows[0]?.earliest ? String(rows[0].earliest) : "";
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
