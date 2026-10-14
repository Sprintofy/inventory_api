'use strict';
import crypto from "crypto";


class Hashing {
    constructor() {
    }

    public async generateHash(password: string, saltRounds: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const salt = crypto.randomBytes(16).toString("hex");
                crypto.scrypt(String(password), salt, 64, (err: any, derived: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`scrypt$${salt}$${derived.toString("hex")}`);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    public async verifyHash(password: string, hashPassword: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                if (!hashPassword || typeof hashPassword !== "string") {
                    resolve(false);
                    return;
                }
                const parts = hashPassword.split("$");
                if (parts.length !== 3 || parts[0] !== "scrypt") {
                    resolve(false);
                    return;
                }
                crypto.scrypt(String(password), parts[1], 64, (err: any, derived: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const a = Buffer.from(derived.toString("hex"), "hex");
                        const b = Buffer.from(parts[2], "hex");
                        resolve(a.length === b.length && crypto.timingSafeEqual(a, b));
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

}

export default new Hashing ();
