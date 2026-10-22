'use strict';
import departmentModel from '../models/department.model';
import { toDepartment, toSubDepartment, asNumber } from "./mappers";

const listDepartments = async () => {
    const rows: any = await departmentModel.listDepartments();
    return rows.map(toDepartment);
};

const createDepartment = async (req: any) => {
    const b = req.body || {};
    const row = {
        id: b.id,
        name: b.name,
        code: b.code || "",
        manager: b.manager || "",
        users_count: asNumber(b.users ?? b.users_count),
        status: b.status || "active",
        color: b.color || "#4f46e5",
    };
    await departmentModel.createDepartment(row);
    return { ...b, users: asNumber(b.users ?? b.users_count), subDepartments: [] };
};

const updateDepartment = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.name !== undefined) data.name = b.name;
    if (b.code !== undefined) data.code = b.code;
    if (b.manager !== undefined) data.manager = b.manager;
    if (b.users !== undefined) data.users_count = asNumber(b.users);
    if (b.users_count !== undefined) data.users_count = asNumber(b.users_count);
    if (b.status !== undefined) data.status = b.status;
    if (b.color !== undefined) data.color = b.color;
    if (Object.keys(data).length > 0) await departmentModel.updateDepartment(id, data);
    return { id, ...b };
};

const removeDepartment = async (req: any) => {
    await departmentModel.deleteDepartment(req.params.id);
    return { id: req.params.id };
};

const listSubs = async () => {
    const rows: any = await departmentModel.listSubDepartments();
    return rows.map(toSubDepartment);
};

const createSub = async (req: any) => {
    const b = req.body || {};
    const row = {
        id: b.id,
        department_id: b.departmentId || b.department_id || "",
        parent_sub_id: b.parentSubDepartmentId || b.parent_sub_id || null,
        name: b.name,
        code: b.code || "",
        manager: b.manager || "",
        users_count: asNumber(b.users ?? b.users_count),
        status: b.status || "active",
        color: b.color || "#4f46e5",
    };
    await departmentModel.createSubDepartment(row);
    return toSubDepartment({
        id: row.id, department_id: row.department_id, parent_sub_id: row.parent_sub_id,
        name: row.name, code: row.code, manager: row.manager,
        users_count: row.users_count, status: row.status, color: row.color,
    });
};

const updateSub = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.name !== undefined) data.name = b.name;
    if (b.code !== undefined) data.code = b.code;
    if (b.manager !== undefined) data.manager = b.manager;
    if (b.users !== undefined) data.users_count = asNumber(b.users);
    if (b.users_count !== undefined) data.users_count = asNumber(b.users_count);
    if (b.status !== undefined) data.status = b.status;
    if (b.color !== undefined) data.color = b.color;
    if (b.departmentId !== undefined) data.department_id = b.departmentId;
    if (b.department_id !== undefined) data.department_id = b.department_id;
    if (b.parentSubDepartmentId !== undefined) data.parent_sub_id = b.parentSubDepartmentId || null;
    if (b.parent_sub_id !== undefined) data.parent_sub_id = b.parent_sub_id || null;
    if (Object.keys(data).length > 0) await departmentModel.updateSubDepartment(id, data);
    return { id, ...b };
};

const removeSub = async (req: any) => {
    await departmentModel.deleteSubDepartment(req.params.id);
    return { id: req.params.id };
};

export default {
    listDepartments,
    createDepartment,
    updateDepartment,
    removeDepartment,
    listSubs,
    createSub,
    updateSub,
    removeSub,
}
