import { putRecord, getAllRecords, delay, getRecord } from "../lib/db";
import { v4 as uuid } from "uuid";

export const submitTask = async (submissionData: any) => {
    await delay(500, 1000);
    const { task_id, worker_id } = submissionData;

    // 1. Get Task and Submissions
    const task = await getRecord("tasks", task_id);
    const allSubmissions = await getAllRecords("submissions");
    const userSubmissions = allSubmissions.filter(
        (s) => s.task_id === task_id && s.worker_id === worker_id
    );

    // 2. Check "Allow Multiple" Constraint
    if (!task.allow_multiple_submissions && userSubmissions.length > 0) {
        throw new Error("You have already submitted this task.");
    }

    // 3. Check "Total Submissions" Constraint
    if (task.submissions_count >= task.amount) {
        throw new Error("This task has reached its maximum submissions limit.");
    }

    // 4. Create New Submission
    const newSubmission = {
        id: uuid(),
        ...submissionData,
        status: "pending",
        date: new Date().toISOString(),
    };

    // 5. Update Task Counter (Only if this is the very first submission for this task)
    // Alternatively, if you want to increment on every submission, remove the check.
    const updatedTask = {
        ...task,
        submissions_count: task.submissions_count + 1,
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
