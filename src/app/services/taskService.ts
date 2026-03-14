import { getRecord, putRecord, getAllRecords, delay } from "../lib/db";
import { v4 as uuid } from "uuid";

// Generic helper to DELETE a record (if you haven't added it to db.ts yet, it's fine, we can do it here)
const deleteRecord = async (storeName: string, key: string): Promise<void> => {
    const { initDB } = await import("../lib/db");
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        transaction.objectStore(storeName).delete(key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getTasks = async () => {
    await delay(500, 1500);
    const tasks = await getAllRecords("tasks");
    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createTask = async (taskData: any) => {
    await delay(1000, 2000);
    const newTask = {
        id: uuid(),
        ...taskData,
        createdAt: new Date().toISOString(),
        status: "active",
        submissions_count: 0
    };
    await putRecord("tasks", newTask);
    return newTask;
};

export const updateTask = async (id: string, taskData: any) => {
    await delay(1000, 2000);
    const existingTask = await getRecord("tasks", id);
    if (!existingTask) throw new Error("Task not found");
    const updatedTask = { ...existingTask, ...taskData };
    await putRecord("tasks", updatedTask);
    return updatedTask;
};

export const deleteTask = async (id: string) => {
    await delay(1000, 2000);
    await deleteRecord("tasks", id);
};

export const getAvailableTasks = async (sortBy: "latest" | "highest_reward") => {
    await delay(500, 1000);
    const tasks = await getAllRecords("tasks");
    
    if (sortBy === "highest_reward") {
        return tasks.sort((a, b) => b.reward - a.reward);
    }
    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};