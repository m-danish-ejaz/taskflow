import { getDB, saveDB } from "../lib/db";
import { delay } from "../lib/delay";
import { hashPassword } from "../lib/hash";
import { v4 as uuid } from "uuid";

export const signup = async (data: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "worker";
}) => {
    const db = getDB();

    const existing = db.users.find((u: any) => u.email === data.email);
    if (existing) throw new Error("Email already registered");

    const passwordHash = await hashPassword(data.password);

    const newUser = {
        id: uuid(),
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB(db);
    await delay()
    return { ...newUser, passwordHash: undefined };
};

export const login = async (email: string, password: string) => {
    const db = getDB();
    const user = db.users.find((u: any) => u.email === email);

    if (!user) throw new Error("User not found");

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) throw new Error("Invalid password");

    return { ...user, passwordHash: undefined };
};