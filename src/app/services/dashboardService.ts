import { getAllRecords } from "../lib/db";

export const getDashboardStats = async (role: "admin" | "worker", workerId?: string) => {
    const tasks = await getAllRecords("tasks");
    const submissions = await getAllRecords("submissions");

    if (role === "admin") {
        return {
            totalTasks: tasks.length,
            totalSubmissions: submissions.length,
            pendingSubmissions: submissions.filter((s: any) => s.status === "pending").length,
            topPayingTasks: [...tasks].sort((a, b) => b.reward - a.reward).slice(0, 5),
            latestSubmissions: [...submissions].sort((a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
        };
    } else {
        if (!workerId) {
            throw new Error("A workerId is required to get worker dashboard stats.");
        }
        const mySubmissions = submissions.filter((s: any) => s.worker_id === workerId);

        const myApproved = mySubmissions.filter((s: any) => s.status === "approved");
        const myPending = mySubmissions.filter((s: any) => s.status === "pending");

        const latestSubmissionsForWorker = [...mySubmissions]
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map(sub => {
                const task = tasks.find(t => t.id === sub.task_id);
                return { ...sub, taskTitle: task?.title || "Untitled Task" };
            });

        return {
            totalEarnings: myApproved.reduce((acc: number, curr: any) => {
                const task = tasks.find((t: any) => t.id === curr.task_id);
                return acc + (task?.reward || 0);
            }, 0),
            activeTasks: tasks.filter(t => t.submissions_count < t.amount).length,
            pendingReview: myPending.length,
            latestSubmissions: latestSubmissionsForWorker

        };
    }
};