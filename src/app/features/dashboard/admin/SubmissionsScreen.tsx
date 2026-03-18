"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubmissions, updateSubmissionStatus } from "@/app/services/submissionService";
import { getAllRecords } from "@/app/lib/db";
import { Check, X, Filter, LayoutGrid, List } from "lucide-react";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import RejectModal from "@/app/components/shared/modals/RejectModal";
import { useSearchParams } from "next/navigation";

export default function SubmissionsScreen() {
    const searchParams = useSearchParams();
    const urlStatus = searchParams.get("status");

    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState(urlStatus || "all");
    const [groupByTask, setGroupByTask] = useState(true);
    const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

    const { data: submissions = [], isLoading } = useQuery({ queryKey: ["submissions"], queryFn: () => getAllRecords("submissions") });
    const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: () => getAllRecords("tasks") });
    const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: () => getAllRecords("users") });

    const statusMutation = useMutation({
        mutationFn: (params: any) => updateSubmissionStatus(params.id, params.status, params.reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submissions"] })
    });

    useEffect(() => {
        if (urlStatus) {
            setFilterStatus(urlStatus);
        } else {
            setFilterStatus("all");
        }
    }, [urlStatus]);
    
    // Process and Group Data
    const processedData = useMemo(() => {
        let filtered = submissions.filter((s: any) => filterStatus === "all" || s.status === filterStatus);

        const enhanced = filtered.map((s: any) => ({
            ...s,
            worker: users.find((u: any) => u.id === s.worker_id),
            task: tasks.find((t: any) => t.id === s.task_id)
        }));

        if (!groupByTask) return enhanced;

        const groups: Record<string, any[]> = {};
        enhanced.forEach(s => {
            const key = s.task?.title || "Unknown Task";
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });

        return Object.entries(groups).map(([title, items]) => ({
            groupTitle: title,
            items
        }));
    }, [submissions, tasks, users, filterStatus, groupByTask]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 text-slate-800">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Submissions Review</h2>
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setGroupByTask(true)}
                        className={`p-2 rounded ${groupByTask ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setGroupByTask(false)}
                        className={`p-2 rounded ${!groupByTask ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
                    >
                        <List size={18} />
                    </button>
                    <select
                        className="text-sm border-none bg-transparent outline-none pr-8"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {groupByTask ? (
                // Grouped View
                (processedData as any[]).map((group: any) => (
                    <div key={group.groupTitle} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">{group.groupTitle}</h3>
                            <span className="text-xs font-medium text-slate-500">{group.items.length} Submissions</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {group.items.map((sub: any) => <SubmissionRow key={sub.id} sub={sub} onApprove={(id: any) => statusMutation.mutate({ id, status: 'approved' })} onReject={(id: any) => setRejectionModal({ isOpen: true, id })} />)}
                        </div>
                    </div>
                ))
            ) : (
                // List View
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
                    {(processedData as any[]).map((sub: any) => (
                        <SubmissionRow
                            key={sub.id}
                            sub={sub}
                            onApprove={(id: any) => statusMutation.mutate({ id, status: 'approved' })}
                            onReject={(id: any) => setRejectionModal({ isOpen: true, id })}
                        />
                    ))}
                </div>
            )}

            <RejectModal
                isOpen={rejectionModal.isOpen}
                onClose={() => setRejectionModal({ isOpen: false, id: null })}
                onConfirm={(reason: any) => {
                    statusMutation.mutate({ id: rejectionModal.id!, status: 'rejected', reason });
                    setRejectionModal({ isOpen: false, id: null });
                }}
            />
        </div>
    );
}

const SubmissionRow = ({ sub, onApprove, onReject }: any) => {
    const displayPhaseIndex = (sub.phase_index ?? 0) + 1;
    const displayPhaseName = sub.phase_name || "Standard Submission";

    const displayReward = sub.reward_amount ?? sub.task?.phases?.[0]?.reward ?? 0;
    const handleViewEvidence = () => {
        if (!sub.evidence_path) return;

        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.title = `Evidence - ${sub.worker?.name || 'Submission'}`;
            newWindow.document.body.style.margin = '0';
            newWindow.document.body.style.display = 'flex';
            newWindow.document.body.style.justifyContent = 'center';
            newWindow.document.body.style.alignItems = 'center';
            newWindow.document.body.style.backgroundColor = '#1a1a1a';

            const img = newWindow.document.createElement('img');
            img.src = sub.evidence_path;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100vh';
            img.style.objectFit = 'contain';
            img.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';

            newWindow.document.body.appendChild(img);
        } else {
            alert("Popup blocked! Please allow popups to view evidence.");
        }
    };

    return (
        <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{sub.worker?.name || "User"}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                        {displayPhaseName}
                    </span>
                </div>
                <div className="text-xs text-slate-500 mb-2">Submitted: {new Date(sub.date).toLocaleString()}</div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                    {sub.post_url && (
                        <a href={sub.post_url} target="_blank" rel="noreferrer" className="text-blue-600 underline block truncate">
                            {sub.post_url}
                        </a>
                    )}
                    {sub.email_content && <p className="text-slate-600 italic whitespace-pre-wrap">"{sub.email_content}"</p>}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {sub.evidence_path ? (
                    <button
                        onClick={handleViewEvidence}
                        className="group relative w-16 h-16 rounded-lg border-2 border-slate-200 overflow-hidden hover:border-blue-500 transition-all shadow-sm"
                        title="Click to enlarge"
                    >
                        <img
                            src={sub.evidence_path}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            alt="evidence"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] text-white font-bold">VIEW</span>
                        </div>
                    </button>
                ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 italic border">
                        No File
                    </div>
                )}

                <div className="flex flex-col items-end gap-2 min-w-[80px]">
                    <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${sub.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        sub.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {sub.status}
                    </div>

                    {sub.status === 'pending' && (
                        <div className="flex gap-1">
                            <button onClick={() => onApprove(sub.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                                <Check size={16} />
                            </button>
                            <button onClick={() => onReject(sub.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="text-sm font-bold text-slate-600">
                        ${Number(displayReward).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};