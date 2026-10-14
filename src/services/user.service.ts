'use strict';
import userModel from '../models/user.model';
import hashing from '../utilities/hashing';
import { cleanUser } from "./mappers";

const strip = (u: any) => {
    const out: any = { ...u };
    delete out.password;
    return out;
};

const list = async () => {
    const rows: any = await userModel.listAll();
    return rows.map(cleanUser);
};

const create = async (req: any) => {
    const b = req.body || {};
    if (!b.email) throw new Error("Email is required");
    const existing: any = await userModel.findByEmail(String(b.email).trim().toLowerCase());
    if (existing.length > 0) throw new Error("Email already exists");
    const hash = await hashing.generateHash(String(b.password || "password"), 10);
    const row = {
        id: b.id,
        name: b.name,
        email: String(b.email).trim().toLowerCase(),
        password_hash: hash,
        employee_id: b.employeeId || b.employee_id || "",
        department: b.department || "",
        sub_department: b.subDepartment || b.sub_department || null,
        post: b.post || null,
        role: b.role === "super-admin" || b.role === "admin" ? b.role : "user",
        status: b.status || "active",
        last_active: b.lastActive || b.last_active || "Never",
        color: b.color || "#4f46e5",
    };
    await userModel.createUser(row);
    const rows: any = await userModel.findById(row.id);
    return cleanUser(rows[0]);
};

const update = async (req: any) => {
    const id = req.params.id;
    const b = strip(req.body || {});
    const data: any = {};
    if (b.name !== undefined) data.name = b.name;
    if (b.email !== undefined) data.email = String(b.email).trim().toLowerCase();
    if (b.password) data.password_hash = await hashing.generateHash(String(b.password), 10);
    if (b.employeeId !== undefined) data.employee_id = b.employeeId;
    if (b.employee_id !== undefined) data.employee_id = b.employee_id;
    if (b.department !== undefined) data.department = b.department;
    if (b.subDepartment !== undefined) data.sub_department = b.subDepartment || null;
    if (b.sub_department !== undefined) data.sub_department = b.sub_department || null;
    if (b.post !== undefined) data.post = b.post || null;
    if (b.role !== undefined) data.role = b.role;
    if (b.status !== undefined) data.status = b.status;
    if (b.lastActive !== undefined) data.last_active = b.lastActive;
    if (b.last_active !== undefined) data.last_active = b.last_active;
    if (b.color !== undefined) data.color = b.color;
    if (Object.keys(data).length > 0) await userModel.updateUser(id, data);
    const rows: any = await userModel.findById(id);
    return cleanUser(rows[0]);
};

const remove = async (req: any) => {
    await userModel.deleteUser(req.params.id);
    return { id: req.params.id };
};

export default {
    list,
    create,
    update,
    remove,
}
