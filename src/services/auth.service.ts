'use strict';
import userModel from '../models/user.model';
import hashing from '../utilities/hashing';
import encryption from '../appConfigs/utilities/encryption';
import CONFIGS from "../config";
import { cleanUser } from "./mappers";

const normalizeRole = (role: string) => (role === "super-admin" || role === "admin" || role === "department-manager" ? role : "user");

const login = async (req: any) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) throw new Error("Email and password are required");

    const userRows: any = await userModel.findByEmail(email);
    if (userRows.length === 0) throw new Error("Invalid credentials");
    const u = userRows[0];
    const match = await hashing.verifyHash(password, u.password_hash || "");
    if (!match) throw new Error("Invalid credentials");
    if (u.status !== "active") throw new Error(`${u.name} is deactivated. Contact your administrator.`);
    const role = u.role === "super-admin" || u.role === "admin" || u.role === "department-manager" ? u.role : normalizeRole(u.role);
    const token = await encryption.generateJwtToken({ id: u.id, role, email: u.email, name: u.name, expires_in: CONFIGS.SECURITY.JWT_TOKEN.EXPIRY });
    return { token, user: { ...cleanUser(u), role } };
};

const me = async (req: any) => {
    const auth: any = req.user;
    if (!auth || !auth.id) throw new Error("Unauthorized");
    const rows: any = await userModel.findById(auth.id);
    if (rows.length === 0) throw new Error("Unauthorized");
    const u = rows[0];
    return { ...cleanUser(u), role: u.role === "super-admin" || u.role === "admin" || u.role === "department-manager" ? u.role : normalizeRole(u.role) };
};

export default {
    login,
    me,
}
