'use strict';
import departmentModel from '../models/department.model';
import { toDepartment } from "./mappers";

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
        status: b.status || "active",
        color: b.color || "#4f46e5",
    };
    await departmentModel.createDepartment(row);
    return { ...b, subDepartments: [] };
};

const updateDepartment = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.name !== undefined) data.name = b.name;
    if (b.code !== undefined) data.code = b.code;
    if (b.manager !== undefined) data.manager = b.manager;
    if (b.status !== undefined) data.status = b.status;
    if (b.color !== undefined) data.color = b.color;
    if (Object.keys(data).length > 0) await departmentModel.updateDepartment(id, data);
    return { id, ...b };
};

const removeDepartment = async (req: any) => {
    await departmentModel.deleteDepartment(req.params.id);
    return { id: req.params.id };
};

export default {
    listDepartments,
    createDepartment,
    updateDepartment,
    removeDepartment,
};
