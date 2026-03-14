import { deleteRecord, putRecord } from "../lib/db";
import { hashPassword } from "../lib/hash";

export const deleteUser = async (email: string) => {
    await deleteRecord("users", email);
};

export const updateUserRole = async (email: string, role: "admin" | "worker") => {
    const db = await import("../lib/db");
    const user = await db.getRecord("users", email);
    if (!user) throw new Error("User not found");

    await putRecord("users", { ...user, role });
};

export const updateProfile = async (email: string, updateData: any) => {
    const db = await import("../lib/db");
    const user = await db.getRecord("users", email);
    if (!user) throw new Error("User not found");

    // If password is being updated, hash it
    if (updateData.password) {
        updateData.passwordHash = await hashPassword(updateData.password);
        delete updateData.password;
    }

    const updatedUser = { ...user, ...updateData };
    await db.putRecord("users", updatedUser);
    return updatedUser;
};