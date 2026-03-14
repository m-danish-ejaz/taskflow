import { getAllRecords } from "../lib/db";

export const getDashboardStats = async (role: "admin" | "worker") => {
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
        const myApproved = submissions.filter((s: any) => s.status === "approved");
        return {
            totalEarnings: myApproved.reduce((acc: number, curr: any) => acc + curr.reward, 0),
            activeTasks: tasks.length,
            pendingReview: submissions.filter((s: any) => s.status === "pending").length
        };
    }
};