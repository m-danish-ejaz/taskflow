import { getAllRecords } from "../lib/db";

export const getDashboardStats = async (role: "admin" | "worker", workerId?: string) => {
    const tasks = await getAllRecords("tasks");
    const submissions = await getAllRecords("submissions");

    if (role === "admin") {
        const tasksWithRewards = tasks.map(t => ({
            ...t,
            displayReward: t.phases?.[0]?.reward || 0
        }));

        const latestSubmissionsMapped = [...submissions]
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map(sub => {
                const task = tasks.find(t => t.id === sub.task_id);
                return {
                    ...sub,
                    taskTitle: task?.title || "Unknown Task"
                };
            });

        return {
            totalTasks: tasks.length,
            totalSubmissions: submissions.length,
            pendingSubmissions: submissions.filter((s: any) => s.status === "pending").length,
            topPayingTasks: tasksWithRewards.sort((a, b) => b.displayReward - a.displayReward).slice(0, 5),
            latestSubmissions: latestSubmissionsMapped
        };
    } else {
        if (!workerId) {
            throw new Error("A workerId is required to get worker dashboard stats.");
        }
        const mySubmissions = submissions.filter((s: any) => s.worker_id === workerId);
        const approvedSubmissions = mySubmissions.filter((s: any) => s.status === "approved");
        const approvedEarnings = approvedSubmissions.reduce((acc, sub) => acc + (sub.reward_amount || 0), 0);
        const pendingEarnings = mySubmissions
            .filter(s => s.status === "pending")
            .reduce((acc, sub) => acc + (sub.reward_amount || 0), 0);

        const latestSubmissionsForWorker = [...mySubmissions]
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map(sub => {
                const task = tasks.find(t => t.id === sub.task_id);
                return { ...sub, taskTitle: task?.title || "Untitled Task" };
            });

        return {
            approvedEarnings,
            totalEarnings: approvedEarnings + pendingEarnings,
            activeTasks: tasks.filter(t => t.submissions_count < t.amount).length,
            pendingReview: mySubmissions.filter(s => s.status === "pending").length,
            latestSubmissions: latestSubmissionsForWorker

        };
    }
};