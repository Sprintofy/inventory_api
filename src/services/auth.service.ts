'use strict';
import userModel from '../models/user.model';
import technicianModel from '../models/technician.model';
import hashing from '../utilities/hashing';
import encryption from '../appConfigs/utilities/encryption';
import CONFIGS from "../config";
import { cleanUser, cleanTechnician } from "./mappers";

const normalizeRole = (role: string) => (role === "super-admin" || role === "admin" ? role : "user");

const login = async (req: any) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) throw new Error("Email and password are required");

    const techRows: any = await technicianModel.findByEmail(email);
    if (techRows.length > 0) {
        const tech = techRows[0];
        const expected = tech.password_hash || "";
        const match = expected ? await hashing.verifyHash(password, expected) : false;
        if (!match) throw new Error("Invalid credentials");
        if (tech.status !== "Active") throw new Error(`${tech.name} is deactivated. Contact your administrator.`);
        const token = await encryption.generateJwtToken({ id: tech.id, role: "technician", email: tech.email, name: tech.name, expires_in: CONFIGS.SECURITY.JWT_TOKEN.EXPIRY });
        return {
            token,
            user: {
                ...cleanTechnician(tech),
                department: "Maintenance",
                role: "technician",
                status: "active",
                lastActive: new Date().toISOString(),
                color: tech.color || "#4f46e5",
            },
        };
    }

    const userRows: any = await userModel.findByEmail(email);
    if (userRows.length === 0) throw new Error("Invalid credentials");
    const u = userRows[0];
    const match = await hashing.verifyHash(password, u.password_hash || "");
    if (!match) throw new Error("Invalid credentials");
    if (u.status !== "active") throw new Error(`${u.name} is deactivated. Contact your administrator.`);
    const role = u.role === "super-admin" ? u.role : normalizeRole(u.role);
    const token = await encryption.generateJwtToken({ id: u.id, role, email: u.email, name: u.name, expires_in: CONFIGS.SECURITY.JWT_TOKEN.EXPIRY });
    return { token, user: { ...cleanUser(u), role } };
};

const me = async (req: any) => {
    const auth: any = req.user;
    if (!auth || !auth.id) throw new Error("Unauthorized");
    if (auth.role === "technician") {
        const rows: any = await technicianModel.findById(auth.id);
        if (rows.length === 0) throw new Error("Unauthorized");
        const tech = rows[0];
        return { ...cleanTechnician(tech), department: "Maintenance", role: "technician", status: "active", color: tech.color || "#4f46e5" };
    }
    const rows: any = await userModel.findById(auth.id);
    if (rows.length === 0) throw new Error("Unauthorized");
    const u = rows[0];
    return { ...cleanUser(u), role: u.role === "super-admin" ? u.role : normalizeRole(u.role) };
};

export default {
    login,
    me,
}
