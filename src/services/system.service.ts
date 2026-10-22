'use strict';
import userModel from '../models/user.model';
import technicianModel from '../models/technician.model';
import departmentModel from '../models/department.model';
import catalogModel from '../models/catalog.model';
import inventoryModel from '../models/inventory.model';
import ticketModel from '../models/ticket.model';
import operationsModel from '../models/operations.model';
import systemModel from '../models/system.model';
import {
    cleanUser, cleanTechnician, toDepartment, toSubDepartment, toCategory,
    toSupplier, toItem, toStockIn, toStockOut, toTransaction, toTicket,
    toIssue, toTransfer, toRequest, toActivity, toNotification, sqlDate,
} from "./mappers";

const bootstrap = async () => {
    const [
        userRows, techRows, deptRows, subRows, catRows, supRows,
        itemRows, sinRows, soutRows, txnRows, ticketRows, issueRows,
        transferRows, requestRows, activityRows, notifRows,
    ] = await Promise.all([
        userModel.listAll(),
        technicianModel.listAll(),
        departmentModel.listDepartments(),
        departmentModel.listSubDepartments(),
        catalogModel.listCategories(),
        catalogModel.listSuppliers(),
        inventoryModel.listItems(),
        inventoryModel.listStockIn(),
        inventoryModel.listStockOut(),
        inventoryModel.listTransactions(),
        ticketModel.listTickets(),
        ticketModel.listAllIssues(),
        operationsModel.listTransfers(),
        operationsModel.listRequests(),
        systemModel.listActivities(),
        systemModel.listNotifications(),
    ]);
    const issuesByTicket = new Map<string, any[]>();
    for (const r of issueRows as any[]) {
        const list = issuesByTicket.get(r.ticket_id) || [];
        list.push(toIssue(r));
        issuesByTicket.set(r.ticket_id, list);
    }
    return {
        users: (userRows as any[]).map(cleanUser),
        technicians: (techRows as any[]).map(cleanTechnician),
        departments: (deptRows as any[]).map(toDepartment),
        subs: (subRows as any[]).map(toSubDepartment),
        categories: (catRows as any[]).map(toCategory),
        suppliers: (supRows as any[]).map(toSupplier),
        items: (itemRows as any[]).map(toItem),
        stockIn: (sinRows as any[]).map(toStockIn),
        stockOut: (soutRows as any[]).map(toStockOut),
        transactions: (txnRows as any[]).map(toTransaction),
        tickets: (ticketRows as any[]).map((r: any) => toTicket(r, issuesByTicket.get(r.id) || [])),
        transfers: (transferRows as any[]).map(toTransfer),
        requests: (requestRows as any[]).map(toRequest),
        activities: (activityRows as any[]).map(toActivity),
        notifications: (notifRows as any[]).map(toNotification),
    };
};

const listActivities = async () => {
    const rows: any = await systemModel.listActivities();
    return rows.map(toActivity);
};

const createActivity = async (req: any) => {
    const b = req.body || {};
    const row = {
        id: b.id, user_name: b.user || b.user_name || "", action: b.action || "",
        module: b.module || "", item: b.item || "", department: b.department || "-",
        date: sqlDate(b.date || new Date()),
    };
    await systemModel.createActivity(row);
    return toActivity(row);
};

const listNotifications = async () => {
    const rows: any = await systemModel.listNotifications();
    return rows.map(toNotification);
};

const markNotificationsRead = async () => {
    await systemModel.markNotificationsRead();
    return { ok: true };
};

export default {
    bootstrap,
    listActivities,
    createActivity,
    listNotifications,
    markNotificationsRead,
}
