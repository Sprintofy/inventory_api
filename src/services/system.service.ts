'use strict';
import userModel from '../models/user.model';
import technicianModel from '../models/technician.model';
import departmentModel from '../models/department.model';
import catalogModel from '../models/catalog.model';
import inventoryModel from '../models/inventory.model';
import systemModel from '../models/system.model';
import {
    cleanUser, cleanTechnician, toDepartment, toCategory,
    toItem, toStockIn, toTransaction, toActivity, sqlDate,
} from "./mappers";

const bootstrap = async () => {
    const [
        userRows, techRows, deptRows, catRows,
        itemRows, sinRows, txnRows, activityRows,
    ] = await Promise.all([
        userModel.listAll(),
        technicianModel.listAll(),
        departmentModel.listDepartments(),
        catalogModel.listCategories(),
        inventoryModel.listItems(),
        inventoryModel.listStockIn(),
        inventoryModel.listTransactions(),
        systemModel.listActivities(),
    ]);
    return {
        users: (userRows as any[]).map(cleanUser),
        technicians: (techRows as any[]).map(cleanTechnician),
        departments: (deptRows as any[]).map(toDepartment),
        categories: (catRows as any[]).map(toCategory),
        items: (itemRows as any[]).map(toItem),
        stockIn: (sinRows as any[]).map(toStockIn),
        transactions: (txnRows as any[]).map(toTransaction),
        activities: (activityRows as any[]).map(toActivity),
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

export default {
    bootstrap,
    listActivities,
    createActivity,
};
