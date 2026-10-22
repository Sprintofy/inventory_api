'use strict';
import operationsModel from '../models/operations.model';
import { toTransfer, toRequest, asNumber, sqlDate } from "./mappers";

const listTransfers = async () => {
    const rows: any = await operationsModel.listTransfers();
    return rows.map(toTransfer);
};

const createTransfer = async (req: any) => {
    const b = req.body || {};
    const row = {
        id: b.id, transfer_no: b.transferNo || b.transfer_no || "",
        from_department: b.fromDepartment || b.from_department || "",
        to_department: b.toDepartment || b.to_department || "",
        item_id: b.itemId || b.item_id || "", item_name: b.itemName || b.item_name || "",
        quantity: asNumber(b.quantity), reason: b.reason || null,
        requested_by: b.requestedBy || b.requested_by || "",
        date: sqlDate(b.date || new Date()), status: b.status || "pending",
        approved_by: b.approvedBy || b.approved_by || null,
        approval_date: b.approvalDate || b.approval_date ? sqlDate(b.approvalDate || b.approval_date) : null,
    };
    await operationsModel.createTransfer(row);
    return toTransfer(row);
};

const updateTransfer = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.status !== undefined) data.status = b.status;
    if (b.approvedBy !== undefined) data.approved_by = b.approvedBy;
    if (b.approved_by !== undefined) data.approved_by = b.approved_by;
    if (data.approved_by) data.approval_date = sqlDate(new Date());
    if (Object.keys(data).length > 0) await operationsModel.updateTransfer(id, data);
    return { id, ...b };
};

const listRequests = async () => {
    const rows: any = await operationsModel.listRequests();
    return rows.map(toRequest);
};

const createRequest = async (req: any) => {
    const b = req.body || {};
    const row = {
        id: b.id, requested_by: b.requestedBy || b.requested_by || "",
        department: b.department || "", sub_department: b.subDepartment || b.sub_department || null,
        item_id: b.itemId || b.item_id || "", item_name: b.itemName || b.item_name || "",
        quantity: asNumber(b.quantity), priority: b.priority || "medium",
        date: sqlDate(b.date || new Date()), status: b.status || "pending",
        reason: b.reason || null,
    };
    await operationsModel.createRequest(row);
    return toRequest(row);
};

const updateRequest = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.status !== undefined) data.status = b.status;
    if (Object.keys(data).length > 0) await operationsModel.updateRequest(id, data);
    return { id, ...b };
};

export default {
    listTransfers,
    createTransfer,
    updateTransfer,
    listRequests,
    createRequest,
    updateRequest,
}
