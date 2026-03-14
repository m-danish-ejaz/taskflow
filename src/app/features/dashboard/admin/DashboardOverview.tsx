"use client";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ListChecks, Users, Clock, TrendingUp } from "lucide-react";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { getDashboardStats } from "@/app/services/dashboardService";

interface DashboardProps {
    role: "admin" | "worker";
}

export default function DashboardOverview({ role }: DashboardProps) {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["stats", role],
        queryFn: () => getDashboardStats(role)
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Welcome back!</h1>
                <p className="text-slate-500">Here is your {role} activity summary.</p>
            </div>

            {/* Stats Grid - Role Specific */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {role === "admin" ? (
                    <>
                        <StatCard title="Total Tasks" value={stats?.totalTasks} icon={ListChecks} color="text-blue-600" />
                        <StatCard title="Pending Reviews" value={stats?.pendingSubmissions} icon={Clock} color="text-amber-600" />
                        <StatCard title="Total Submissions" value={stats?.totalSubmissions} icon={Users} color="text-emerald-600" />
                    </>
                ) : (
                    <>
                        <StatCard title="Total Earnings" value={`$${stats?.totalEarnings.toFixed(2)}`} icon={DollarSign} color="text-emerald-600" />
                        <StatCard title="Available Tasks" value={stats?.activeTasks} icon={ListChecks} color="text-blue-600" />
                        <StatCard title="Pending Review" value={stats?.pendingReview} icon={Clock} color="text-amber-600" />
                    </>
                )}
            </div>

            {/* Bottom Content - Role Specific */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {role === "admin" ? (
                    <>
                        <TopTasksList tasks={stats?.topPayingTasks} />
                        <LatestSubmissions submissions={stats?.latestSubmissions} />
                    </>
                ) : (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-2">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="text-blue-600" /> Recent Progress
                        </h3>
                        <p className="text-slate-500 text-sm">Keep completing tasks to increase your weekly earnings and unlock higher-paying tiers!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Sub-components for clean code
const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 bg-slate-50 rounded-xl ${color}`}><Icon size={24} /></div>
    </div>
);

const TopTasksList = ({ tasks }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Paying Tasks</h3>
        <div className="space-y-4">
            {tasks.map((t: any) => (
                <div key={t.id} className="flex justify-between p-3 border-b last:border-0 hover:bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{t.title}</span>
                    <span className="text-sm font-bold text-emerald-600">+${t.reward.toFixed(2)}</span>
                </div>
            ))}
        </div>
    </div>
);

const LatestSubmissions = ({ submissions }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Latest Submissions</h3>
        <div className="space-y-4">
            {submissions.map((s: any) => (
                <div key={s.id} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0">
                    <div>
                        <p className="text-sm font-medium text-slate-700">{s.taskTitle}</p>
                        <p className="text-xs text-slate-400">{new Date(s.date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{s.status}</span>
                </div>
            ))}
        </div>
    </div>
);