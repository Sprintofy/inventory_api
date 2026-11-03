'use strict';
import inventoryModel from "../models/inventory.model";
import systemModel from "../models/system.model";
import {
  toItem,
  toStockIn,
  toTransaction,
  toActivity,
  asNumber,
  sqlDate,
} from "./mappers";

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

const getNextStockInSeq = async (): Promise<number> => {
  const max = await inventoryModel.getMaxId("stock_in_records", "id");
  return (parseInt(String(max.maxId || 0)) || 0) + 1;
};

const yy = (): string => new Date().toISOString().slice(2, 4);

const listItems = async () => {
  const rows: any = await inventoryModel.listItems();
  return rows.map(toItem);
};

const createItem = async (req: any) => {
  const b = req.body || {};
  const now = sqlDate(new Date());
  const row = {
    id: b.id,
    device_name: b.deviceName || b.device_name || "",
    brand: b.brand || "",
    type: b.type || "C",
    category: b.category || "",
    notes: b.notes || null,
    sku: b.sku,
    quantity: asNumber(b.quantity),
    status: b.status || "active",
    department: b.department || "",
    cpu_type: b.cpuType || null,
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
  if (b.brand !== undefined) data.brand = b.brand;
  if (b.type !== undefined) data.type = b.type;
  if (b.category !== undefined) data.category = b.category;
  if (b.notes !== undefined) data.notes = b.notes || null;
  if (b.sku !== undefined) data.sku = b.sku;
  if (b.quantity !== undefined) data.quantity = asNumber(b.quantity);
  if (b.status !== undefined) data.status = b.status;
  if (b.department !== undefined) data.department = b.department;
  if (b.cpuType !== undefined) data.cpu_type = b.cpuType || null;
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
  const year = yy();

  // Get department code for Work Order Id
  const deptRows: any = await inventoryModel.findDepartmentByName(
    item.department || "",
  );
  const deptCode =
    deptRows.length > 0 ? deptRows[0].code : item.department || "ADM";

  // Insert first so MySQL assigns the auto-increment id
  const insert = {
    work_order_id: "",
    job_no: "",
    item_id: item.id,
    item_name: item.device_name,
    product_type: item.type || "C",
    quantity: asNumber(b.quantity),
    date_in: now,
    date_out: null,
    remarks: null,
    department: item.department || "",
    created_by: by(req),
    status: "pending",
  };
  const result: any = await inventoryModel.createStockIn(insert);
  const stockInId = result.insertId;

  const workOrderId = `NDA/${deptCode}/IT/${year}`;
  const jobNo = `${item.type || "C"}/${stockInId}/${year}`;

  await inventoryModel.updateStockIn(stockInId, {
    work_order_id: workOrderId,
    job_no: jobNo,
  });

  await inventoryModel.updateItem(item.id, {
    quantity: qty,
    last_updated: now,
  });

  const txn = {
    id: `TXN-${Date.now()}`,
    type: "stock-in",
    reference: workOrderId,
    item_id: item.id,
    item_name: item.device_name,
    quantity: asNumber(b.quantity),
    department: item.department || "",
    to_department: null,
    supplier: null,
    created_by: by(req),
    date: now,
    note: null,
  };
  await inventoryModel.createTransaction(txn);

  const act = {
    id: `ACT-${Date.now()}`,
    user: by(req),
    action: "received stock",
    module: "Stock In",
    item: item.device_name,
    department: item.department || "-",
    date: now,
  };
  await systemModel.createActivity(activityRow(act));

  const updated: any = await inventoryModel.findItem(item.id);
  const record: any = await inventoryModel.getStockInById(stockInId);
  return {
    item: toItem(updated[0]),
    transaction: toTransaction(txn),
    record: toStockIn(record[0]),
    activity: toActivity(act),
  };
};

const stockOut = async (req: any) => {
  const b = req.body || {};
  const id = b.id || b.stockInId;
  if (!id) throw new Error("Stock in record id is required");
  const remarks = b.remarks || b.remark || "";

  const rows: any = await inventoryModel.getStockInById(id);
  if (rows.length === 0) throw new Error("Stock in record not found");
  const record = rows[0];

  const itemRows: any = await inventoryModel.findItem(record.item_id);
  if (itemRows.length === 0) throw new Error("Item not found");
  const item = itemRows[0];

  if (asNumber(record.quantity) > asNumber(item.quantity)) {
    throw new Error(
      `Insufficient stock — only ${item.quantity} available`,
    );
  }

  const now = sqlDate(new Date());
  const qty = Math.max(0, asNumber(item.quantity) - asNumber(record.quantity));

  await inventoryModel.stockOut(id, remarks);
  await inventoryModel.updateItem(item.id, {
    quantity: qty,
    last_updated: now,
  });

  const txn = {
    id: `TXN-${Date.now()}`,
    type: "stock-out",
    reference: record.work_order_id || "",
    item_id: item.id,
    item_name: item.device_name,
    quantity: -asNumber(record.quantity),
    department: item.department || "",
    to_department: null,
    supplier: null,
    created_by: by(req),
    date: now,
    note: remarks || null,
  };
  await inventoryModel.createTransaction(txn);

  const act = {
    id: `ACT-${Date.now()}`,
    user: by(req),
    action: "issued stock",
    module: "Stock Out",
    item: item.device_name,
    department: item.department || "-",
    date: now,
  };
  await systemModel.createActivity(activityRow(act));

  const updated: any = await inventoryModel.findItem(item.id);
  const outRecord: any = await inventoryModel.getStockInById(id);
  return {
    item: toItem(updated[0]),
    transaction: toTransaction(txn),
    record: toStockIn(outRecord[0]),
    activity: toActivity(act),
  };
};

const listStockIn = async (req: any) => {
  const q = req.query || {};
  const filters = {
    dateFrom: q.dateFrom,
    dateTo: q.dateTo,
    status: q.status,
    search: q.search,
  };
  const data = await inventoryModel.listStockIn(filters);
  return data.map(toStockIn);
};

const getStockInHistory = async (req: any) => {
  const q = req.query || {};
  const data = await inventoryModel.getStockInHistory(q.itemId);
  return data.map(toStockIn);
};

const listTransactions = async () => {
  const rows: any = await inventoryModel.listTransactions();
  return rows.map(toTransaction);
};

export default {
  listItems,
  createItem,
  updateItem,
  stockIn,
  stockOut,
  listStockIn,
  getStockInHistory,
  listTransactions,
};
