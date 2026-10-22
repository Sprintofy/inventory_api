'use strict';
import technicianModel from '../models/technician.model';
import hashing from '../utilities/hashing';
import { cleanTechnician, asNumber } from "./mappers";

const strip = (u: any) => {
    const out: any = { ...u };
    delete out.password;
    return out;
};

const list = async () => {
    const rows: any = await technicianModel.listAll();
    return rows.map(cleanTechnician);
};

const create = async (req: any) => {
    const b = req.body || {};
    if (!b.email) throw new Error("Email is required");
    const existing: any = await technicianModel.findByEmail(String(b.email).trim().toLowerCase());
    if (existing.length > 0) throw new Error("Email already exists");
    const hash = await hashing.generateHash(String(b.password || "123456"), 10);
    const row = {
        id: b.id,
        name: b.name,
        email: String(b.email).trim().toLowerCase(),
        password_hash: hash,
        employee_id: b.employeeId || b.employee_id || "",
        specialization: b.specialization || "General",
        availability: b.availability || "Available",
        status: b.status || "Active",
        phone: b.phone || null,
        color: b.color || null,
        active_tickets: asNumber(b.activeTickets ?? b.active_tickets),
        resolved_tickets: asNumber(b.resolvedTickets ?? b.resolved_tickets),
        last_active: b.lastActive || b.last_active || null,
    };
    await technicianModel.createTechnician(row);
    const rows: any = await technicianModel.findById(row.id);
    return cleanTechnician(rows[0]);
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
    if (b.specialization !== undefined) data.specialization = b.specialization;
    if (b.availability !== undefined) data.availability = b.availability;
    if (b.status !== undefined) data.status = b.status;
    if (b.phone !== undefined) data.phone = b.phone || null;
    if (b.color !== undefined) data.color = b.color || null;
    if (b.activeTickets !== undefined) data.active_tickets = asNumber(b.activeTickets);
    if (b.active_tickets !== undefined) data.active_tickets = asNumber(b.active_tickets);
    if (b.resolvedTickets !== undefined) data.resolved_tickets = asNumber(b.resolvedTickets);
    if (b.resolved_tickets !== undefined) data.resolved_tickets = asNumber(b.resolved_tickets);
    if (b.lastActive !== undefined) data.last_active = b.lastActive || null;
    if (b.last_active !== undefined) data.last_active = b.last_active || null;
    if (Object.keys(data).length > 0) await technicianModel.updateTechnician(id, data);
    const rows: any = await technicianModel.findById(id);
    return cleanTechnician(rows[0]);
};

const remove = async (req: any) => {
    await technicianModel.deleteTechnician(req.params.id);
    return { id: req.params.id };
};

export default {
    list,
    create,
    update,
    remove,
}
