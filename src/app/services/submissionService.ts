import { putRecord, getAllRecords, delay, getRecord } from "../lib/db";
import { v4 as uuid } from "uuid";

export const submitTask = async (submissionData: any) => {
    await delay(1000, 2000); // Mimic network latency
    const { task_id, worker_id } = submissionData;

    const task = await getRecord("tasks", task_id);
    if (!task) throw new Error("Task not found");

    // 1. Determine current active phase based on total submissions
    let currentSubmissions = task.submissions_count || 0;
    let activePhaseIndex = 0;
    let accumulatedSlots = 0;

    for (let i = 0; i < task.phases.length; i++) {
        accumulatedSlots += task.phases[i].slots;
        if (currentSubmissions < accumulatedSlots) {
            activePhaseIndex = i;
            break;
        }
        activePhaseIndex = i; // Fallback to last phase if full
    }

    const activePhase = task.phases[activePhaseIndex];

    // 2. Constraints Check
    if (currentSubmissions >= task.phases.reduce((acc: number, p: any) => acc + p.slots, 0)) {
        throw new Error("This task and all its phases are fully completed.");
    }

    // 3. Create Submission with Snapshot of Phase Data
    const newSubmission = {
        id: uuid(),
        ...submissionData,
        phase_index: activePhaseIndex,
        phase_name: activePhase.phase_name,
        reward_amount: activePhase.reward, // Snapshot reward at time of submission
        status: "pending",
        date: new Date().toISOString(),
    };

    // 4. Increment task global counter
    const updatedTask = {
        ...task,
        submissions_count: (task.submissions_count || 0) + 1,
    };

    await putRecord("tasks", updatedTask);
    await putRecord("submissions", newSubmission);

    return newSubmission;
};


export const updateSubmissionStatus = async (id: string, status: "approved" | "rejected", reason?: string) => {
    await delay(1000, 2000);
    const db = await import("../lib/db");
    const submission = await db.getRecord("submissions", id);

    if (!submission) throw new Error("Submission not found");

    const updated = { ...submission, status, reason };
    await db.putRecord("submissions", updated);
    return updated;
};

export const getSubmissions = async () => {
    const { getAllRecords } = await import("../lib/db");
    return await getAllRecords("submissions");
};
