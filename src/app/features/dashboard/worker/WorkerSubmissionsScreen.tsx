"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRecords } from "@/app/lib/db";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { Clock, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function WorkerSubmissionsScreen({ workerId }: { workerId: string }) {
    const searchParams = useSearchParams();
    const urlStatus = searchParams.get("status");
    const [filterStatus, setFilterStatus] = useState("all");

    const { data: submissions = [], isLoading } = useQuery({
        queryKey: ["worker-submissions", workerId],
        queryFn: () => getAllRecords("submissions")
    });

    const { data: tasks = [] } = useQuery<any[]>({
        queryKey: ["tasks"],
        queryFn: () => getAllRecords("tasks")
    });

    useEffect(() => {
        setFilterStatus(urlStatus || "all");
    }, [urlStatus]);

    const myData = useMemo(() => {
        let filtered = submissions.filter((s: any) => s.worker_id === workerId);
        if (urlStatus && urlStatus !== 'all') {
            filtered = filtered.filter((s: any) => s.status === urlStatus);
        }
        return submissions
            .filter((s: any) => s.worker_id === workerId)
            .filter((s: any) => filterStatus === "all" || s.status === filterStatus)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((s: any) => ({
                ...s,
                taskTitle: tasks.find((t: any) => t.id === s.task_id)?.title || "Deleted Task"
            }));
    }, [submissions, tasks, workerId, filterStatus]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 text-slate-800">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">History</h2>
                    <p className="text-slate-500 text-sm">Review your past task completions and earnings</p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <DollarSign size={18} className="text-emerald-600" />
                    <span className="text-xl font-bold text-emerald-700">
                        {/* Added safety ?? 0 for total calculation */}
                        {myData
                            .filter(s => s.status === 'approved')
                            .reduce((acc, curr) => acc + (Number(curr.reward_amount) || 0), 0)
                            .toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="grid gap-4">
                {myData.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-slate-400">
                        No submissions found yet. Start earning!
                    </div>
                ) : (
                    myData.map((sub: any) => {
                        // Safety Checks for old data
                        const phaseNumber = (sub.phase_index ?? 0) + 1;
                        const phaseName = sub.phase_name || "Standard Phase";
                        const rewardValue = sub.reward_amount ?? 0;

                        return (
                            <div key={sub.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                        sub.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {sub.status === 'approved' && <CheckCircle2 size={24} />}
                                        {sub.status === 'rejected' && <XCircle size={24} />}
                                        {sub.status === 'pending' && <Clock size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{sub.taskTitle}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {/* Fix: Handled NaN by using phaseNumber fallback */}
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                {phaseName}
                                            </span>
                                            <span className="text-[10px] text-slate-300">•</span>
                                            <span className="text-[10px] text-slate-400">{new Date(sub.date).toLocaleDateString()}</span>
                                        </div>
                                        {sub.reason && (
                                            <p className="mt-2 text-xs bg-red-50 text-red-600 p-2 rounded border border-red-100">
                                                <b>Admin Note:</b> {sub.reason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    {/* Fix: Handled missing reward by using rewardValue fallback */}
                                    <div className="text-lg font-bold text-slate-800">
                                        ${Number(rewardValue).toFixed(2)}
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase ${sub.status === 'approved' ? 'text-emerald-500' :
                                        sub.status === 'rejected' ? 'text-red-500' : 'text-amber-500'
                                        }`}>
                                        {sub.status}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}