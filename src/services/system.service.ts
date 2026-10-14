'use strict';
import systemModel from '../models/system.model';
import { toActivity, toNotification, sqlDate } from "./mappers";

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
    listActivities,
    createActivity,
    listNotifications,
    markNotificationsRead,
}
