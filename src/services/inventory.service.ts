'use strict';
import inventoryModel from '../models/inventory.model';
import systemModel from '../models/system.model';
import { toItem, toStockIn, toStockOut, toTransaction, toActivity, asNumber, sqlDate } from "./mappers";

const by = (req: any) => (req.user && req.user.name) || "Admin";

const activityRow = (a: any) => ({
    id: a.id,
    user_name: a.user,
    action: a.action,
    module: a.module,
    item: a.item,
    department: a.department,
    date: sqlDate(a.date),
});

const getNextStockOutId = async (): Promise<string> => {
    const maxStockOut = await inventoryModel.getMaxId("stock_out_records", "id");
    const maxSouNum = parseInt(String(maxStockOut.maxId).replace("SOU-", "")) || 0;
    return (maxSouNum + 1).toString().padStart(3, '0');
};

const listItems = async () => {
    const rows: any = await inventoryModel.listItems();
    return rows.map(toItem);
};

const createItem = async (req: any) => {
    const b = req.body || {};
    const now = sqlDate(new Date());
    const row = {
        id: b.id, device_name: b.deviceName || b.device_name || "", brand: b.brand || "",
        model_number: b.modelNumber || b.model_number || "", category: b.category || "",
        description: b.description || null, specifications: b.specifications || null,
        warranty_period: b.warrantyPeriod || b.warranty_period || null,
        serial_number: b.serialNumber || b.serial_number || null, notes: b.notes || null,
        sku: b.sku, supplier: b.supplier || null, quantity: asNumber(b.quantity),
        unit: b.unit || "unit", status: b.status || "active",
        department: b.department || "", sub_department: b.subDepartment || b.sub_department || null,
        last_updated: sqlDate(b.lastUpdated || b.last_updated || now),
        created_at: sqlDate(b.createdAt || b.created_at || now),
    };
    await inventoryModel.createItem(row);
    const rows: any = await inventoryModel.findItem(row.id);
    return toItem(rows[0]);
};

const updateItem = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.deviceName !== undefined) data.device_name = b.deviceName;
    if (b.device_name !== undefined) data.device_name = b.device_name;
    if (b.brand !== undefined) data.brand = b.brand;
    if (b.modelNumber !== undefined) data.model_number = b.modelNumber;
    if (b.model_number !== undefined) data.model_number = b.model_number;
    if (b.category !== undefined) data.category = b.category;
    if (b.description !== undefined) data.description = b.description || null;
    if (b.specifications !== undefined) data.specifications = b.specifications || null;
    if (b.warrantyPeriod !== undefined) data.warranty_period = b.warrantyPeriod || null;
    if (b.warranty_period !== undefined) data.warranty_period = b.warranty_period || null;
    if (b.serialNumber !== undefined) data.serial_number = b.serialNumber || null;
    if (b.serial_number !== undefined) data.serial_number = b.serial_number || null;
    if (b.notes !== undefined) data.notes = b.notes || null;
    if (b.sku !== undefined) data.sku = b.sku;
    if (b.supplier !== undefined) data.supplier = b.supplier || null;
    if (b.quantity !== undefined) data.quantity = asNumber(b.quantity);
    if (b.unit !== undefined) data.unit = b.unit;
    if (b.status !== undefined) data.status = b.status;
    if (b.department !== undefined) data.department = b.department;
    if (b.subDepartment !== undefined) data.sub_department = b.subDepartment || null;
    if (b.sub_department !== undefined) data.sub_department = b.sub_department || null;
    data.last_updated = sqlDate(b.lastUpdated || b.last_updated || new Date());
    await inventoryModel.updateItem(id, data);
    const rows: any = await inventoryModel.findItem(id);
    return toItem(rows[0]);
};

const stockIn = async (req: any) => {
    const b = req.body || {};
    const itemRows: any = await inventoryModel.findItem(b.itemId || b.item_id);
    if (itemRows.length === 0) throw new Error("Item not found");
    const item = itemRows[0];
    const qty = asNumber(item.quantity) + asNumber(b.quantity);
    const now = sqlDate(new Date());

    // Generate sequential stock in ID (001, 002, 003...)
    const maxStockIn = await inventoryModel.getMaxId("stock_in_records", "id");
    const maxSiNum = parseInt(String(maxStockIn.maxId).replace("SI-", "")) || 0;
    const stockInId = (maxSiNum + 1).toString().padStart(3, '0');

    await inventoryModel.updateItem(item.id, { quantity: qty, last_updated: now });
    const txn = {
        id: b.txnId || b.txn_id || `TXN-${Date.now()}`,
        type: "stock-in", reference: b.ref || b.reference || "",
        item_id: item.id, item_name: item.device_name, quantity: asNumber(b.quantity),
        department: item.department || "", to_department: null,
        supplier: b.supplier || null, created_by: by(req), date: now, note: b.note || null,
    };
    await inventoryModel.createTransaction(txn);
    const record = {
        id: b.recordId || b.record_id || stockInId,
        reference: b.ref || b.reference || "", date: now, supplier: b.supplier || "",
        item_id: item.id, item_name: item.device_name, items_count: 1, quantity: asNumber(b.quantity),
        department: item.department || "", created_by: by(req), status: "received",
    };
    await inventoryModel.createStockIn(record);
    const act = { id: b.activityId || `ACT-${Date.now()}`, user: by(req), action: "received stock", module: "Stock In", item: item.device_name, department: item.department || "-", date: now };
    await systemModel.createActivity(activityRow(act));
    const updated: any = await inventoryModel.findItem(item.id);
    return { item: toItem(updated[0]), transaction: toTransaction(txn), record: toStockIn(record), activity: toActivity(act) };
};

const stockOut = async (req: any) => {
    const b = req.body || {};
    const itemRows: any = await inventoryModel.findItem(b.itemId || b.item_id);
    if (itemRows.length === 0) throw new Error("Item not found");
    const item = itemRows[0];
    if (asNumber(b.quantity) > asNumber(item.quantity)) throw new Error(`Insufficient stock — only ${item.quantity} available`);
    const qty = Math.max(0, asNumber(item.quantity) - asNumber(b.quantity));
    const now = sqlDate(new Date());

    // Use the same ID as the most recent Stock In for this item (if exists)
    const stockInRows: any = await inventoryModel.getLatestStockInByItemId(item.id);
    const stockOutId = stockInRows.length > 0 ? stockInRows[0].id : await getNextStockOutId();

    await inventoryModel.updateItem(item.id, { quantity: qty, last_updated: now });
    const txn = {
        id: b.txnId || `TXN-${Date.now()}`,
        type: "stock-out", reference: b.ref || b.reference || "",
        item_id: item.id, item_name: item.device_name, quantity: -asNumber(b.quantity),
        department: item.department || "", to_department: null,
        supplier: null, created_by: by(req), date: now, note: b.note || null,
    };
    await inventoryModel.createTransaction(txn);
    const record = {
        id: b.recordId || b.record_id || stockOutId,
        reference: b.ref || b.reference || "", date: now,
        item_id: item.id, item_name: item.device_name,
        recipient: b.recipient || "", department: item.department || "",
        purpose: b.purpose || "", quantity: asNumber(b.quantity), status: "issued",
    };
    await inventoryModel.createStockOut(record);
    const act = { id: b.activityId || `ACT-${Date.now()}`, user: by(req), action: "issued stock", module: "Stock Out", item: item.device_name, department: item.department || "-", date: now };
    await systemModel.createActivity(activityRow(act));
    const updated: any = await inventoryModel.findItem(item.id);
    return { item: toItem(updated[0]), transaction: toTransaction(txn), record: toStockOut(record), activity: toActivity(act) };
};

const listStockIn = async (req: any) => {
    const q = req.query || {};
    const filters = {
        dateFrom: q.dateFrom,
        dateTo: q.dateTo,
        status: q.status,
        supplier: q.supplier,
        search: q.search,
    };
    const rows: any = await inventoryModel.listStockIn(filters);
    return rows.map(toStockIn);
};

const listStockOut = async (req: any) => {
    const q = req.query || {};
    const filters = {
        dateFrom: q.dateFrom,
        dateTo: q.dateTo,
        status: q.status,
        search: q.search,
    };
    const rows: any = await inventoryModel.listStockOut(filters);
    return rows.map(toStockOut);
};

const listTransactions = async () => {
    const rows: any = await inventoryModel.listTransactions();
    return rows.map(toTransaction);
};

const setStockInStatus = async (req: any) => {
    const b = req.body || {};
    await inventoryModel.updateStockInStatus(req.params.id, b.status);
    return { id: req.params.id, status: b.status };
};

const setStockOutStatus = async (req: any) => {
    const b = req.body || {};
    await inventoryModel.updateStockOutStatus(req.params.id, b.status);
    return { id: req.params.id, status: b.status };
};

const getStockInHistory = async (req: any) => {
    const rows: any = await inventoryModel.getStockInHistory(req.query.itemId);
    return rows.map(toStockIn);
};

const getStockOutHistory = async (req: any) => {
    const rows: any = await inventoryModel.getStockOutHistory(req.query.itemId);
    return rows.map(toStockOut);
};

export default {
    listItems,
    createItem,
    updateItem,
    stockIn,
    stockOut,
    listStockIn,
    listStockOut,
    listTransactions,
    setStockInStatus,
    setStockOutStatus,
    getStockInHistory,
    getStockOutHistory,
}
