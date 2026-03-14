import { getRecord, putRecord, delay } from "../lib/db";
import { v4 as uuid } from "uuid";
import { hashPassword } from "../lib/hash";



export const signup = async (data: any) => {
    await delay();
    const existingUser = await getRecord("users", data.email);
    if (existingUser) {
        throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(data.password);

    const newUser = {
        id: uuid(),
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || "worker",
        createdAt: new Date().toISOString(),
    };

    await putRecord("users", newUser);

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
};

export const login = async (email: string, password: string) => {
    await delay();
    const user = await getRecord("users", email);
    if (!user) {
        throw new Error("User not found");
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
        throw new Error("Invalid password");
    }
    
    const { passwordHash: _, ...safeUser } = user;
    
    const EIGHT_HOURS = 8 * 60 * 60 * 1000;
    const sessionData = {
        user: safeUser, 
        expiresAt: Date.now() + EIGHT_HOURS,
    };
    localStorage.setItem("active_session", JSON.stringify(sessionData));
    return safeUser;
};

export const makeUserAdmin = async (email: string) => {
    try {
        const user = await getRecord("users", email);
        
        if (!user) {
            console.error("❌ User not found in database!");
            return false;
        }

        user.role = "admin";
        
        await putRecord("users", user);
        console.log(`✅ Success: ${email} is now an ADMIN!`);

        const sessionStr = localStorage.getItem("active_session");
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session.user.email === email) {
                session.user.role = "admin";
                localStorage.setItem("active_session", JSON.stringify(session));
                console.log("🔄 Active session updated! Refreshing page...");
                window.location.href = "/";
            }
        }
        return true;
    } catch (error) {
        console.error("❌ Failed to update user:", error);
        return false;
    }
};