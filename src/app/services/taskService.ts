import { getRecord, putRecord, getAllRecords, delay, deleteRecord } from "../lib/db";
import { v4 as uuid } from "uuid";

export const getTasks = async () => {
    await delay(500, 1000);
    const tasks = await getAllRecords("tasks");
    return tasks.map(calculateTaskMetadata).sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// Helper to calculate Drip and Phase status
export function calculateTaskMetadata(task: any) {
    const now = Date.now();
    const created = new Date(task.createdAt).getTime();

    // 1. Drip Feed Calculation
    let availableSlots = 0;
    let dripStatus = "Active";
    let nextReleaseIn = null;

    if (task.drip_feed?.enabled) {
        const intervalMs = task.drip_feed.interval * 60 * 60 * 1000;
        const intervalsPassed = Math.floor((now - created) / intervalMs) + 1;
        const totalReleased = intervalsPassed * task.drip_feed.amount;
        
        const totalPossibleSlots = task.phases.reduce((acc: number, p: any) => acc + p.slots, 0);
        availableSlots = Math.min(totalPossibleSlots, totalReleased);
        
        if (availableSlots >= totalPossibleSlots) {
            dripStatus = "Completed";
        } else {
            const nextTime = created + (intervalsPassed * intervalMs);
            nextReleaseIn = Math.max(0, Math.ceil((nextTime - now) / (60 * 1000))); // minutes
            dripStatus = "Waiting";
        }
    } else {
        availableSlots = task.phases.reduce((acc: number, p: any) => acc + p.slots, 0);
    }

    // 2. Phase Calculation (Sequential)
    let activePhaseIndex = 0;
    let tempSubCount = task.submissions_count || 0;

    for (let i = 0; i < task.phases.length; i++) {
        if (tempSubCount < task.phases[i].slots) {
            activePhaseIndex = i;
            break;
        }
        tempSubCount -= task.phases[i].slots;
        activePhaseIndex = i; // If all completed, last phase stays "active" but full
    }

    return { 
        ...task, 
        activePhaseIndex, 
        availableSlots, 
        dripStatus, 
        nextReleaseIn,
        totalSlots: task.phases.reduce((acc: number, p: any) => acc + p.slots, 0)
    };
}

export const createTask = async (taskData: any) => {
    await delay(1000, 2000);
    const newTask = {
        id: uuid(),
        ...taskData,
        submissions_count: 0,
        createdAt: new Date().toISOString(),
        status: "active",
    };
    await putRecord("tasks", newTask);
    return newTask;
};

export const bulkCreateTasks = async (tasksArray: any[]) => {
    await delay(2000, 3000);
    for (const task of tasksArray) {
        await createTask(task);
    }
};

export const updateTask = async (id: string, taskData: any) => {
    const existing = await getRecord("tasks", id);
    const updated = { ...existing, ...taskData };
    await putRecord("tasks", updated);
    return updated;
};

export const deleteTask = async (id: string) => {
    await deleteRecord("tasks", id);
};

export const getAvailableTasks = async (sortBy: string) => {
    const all = await getTasks();
    // Filter out tasks where drip hasn't released anything yet or all phases are done
    return all.filter(t => {
        const isFull = t.submissions_count >= t.totalSlots;
        return !isFull;
    });
};