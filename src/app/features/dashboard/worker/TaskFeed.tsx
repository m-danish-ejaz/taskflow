"use client";
import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getAvailableTasks } from "@/app/services/taskService";
import { DollarSign, Clock, ChevronRight, X, Loader2, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { FormInput } from "@/app/Models/FormInputs";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import { submitTask } from "@/app/services/submissionService";
import { toast } from "@/app/components/ui/toast/use-toast";
import { useAuth } from "@/app/hooks/useAuth";

const inputClass = "w-full mt-1 px-3 bg-transparent py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900";
const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider";

const getFieldsForTask = (task: any): FormInput[] => {
    const commonFields: FormInput[] = [
        {
            modelName: "evidence_file",
            label: "Screenshot Evidence",
            type: "file",
            inputClass: `border-2 border-dashed border-gray-400 ${inputClass}`,
            labelClass,
            validators: [{ type: "required", message: "Screenshot is required" }]
        }
    ];

    if (task.task_type === "Email Sending") {
        return [
            {
                modelName: "email_content",
                label: "Email Content",
                type: "textarea",
                inputClass,
                labelClass,
                placeholder: "Paste the email you sent...",
                validators: [{ type: "required", message: "Email content is required" }]
            },
            ...commonFields
        ];
    }

    return [
        {
            modelName: "post_url",
            label: "Post URL",
            type: "text",
            inputClass,
            labelClass,
            placeholder: "Paste your social media link...",
            validators: [
                { type: "required", message: "URL is required" },
                { type: "pattern", value: /^https?:\/\/.+/, message: "Invalid URL" }
            ]
        },
        ...commonFields
    ];
};

export default function TaskFeed() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [sortBy, setSortBy] = useState<"latest" | "highest_reward">("latest");
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // NEW: Loading state

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["worker-tasks", sortBy],
        queryFn: () => getAvailableTasks(sortBy),
    });

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 110,
        overscan: 6,
    });

    if (isLoading) return <LoadingSpinner />;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;


    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);

        // 1. Capture the reward amount for the optimistic update
        const activePhase = selectedTask.phases[selectedTask.activePhaseIndex];
        const rewardToRecord = activePhase.reward;

        try {
            // --- OPTIMISTIC UPDATE START ---
            // We manually update the 'stats' query cache so the dashboard shows the money immediately
            queryClient.setQueryData(["stats", "worker", user?.id], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    // We add the reward to a "Pending" or "Total" balance
                    totalEarnings: oldData.totalEarnings + rewardToRecord,
                    pendingReview: oldData.pendingReview + 1
                };
            });
            // --- OPTIMISTIC UPDATE END ---

            const file = Array.isArray(data.evidence_file) ? data.evidence_file[0] : data.evidence_file;
            const base64Evidence = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });

            const submissionPayload = {
                ...data,
                evidence_path: base64Evidence,
                evidence_file: undefined,
                task_id: selectedTask.id,
                worker_id: user?.id,
                // We pass the reward so the service saves the snapshot
                reward_amount: rewardToRecord,
                phase_index: selectedTask.activePhaseIndex,
                phase_name: activePhase.phase_name
            };

            await submitTask(submissionPayload);

            toast({ title: "Success", description: `Task submitted! $${rewardToRecord} added to pending.` });

            // Final sync with "server"
            queryClient.invalidateQueries({ queryKey: ["worker-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["worker-submissions"] });
            setSelectedTask(null);
        } catch (error: any) {
            // Rollback optimistic update on error
            queryClient.invalidateQueries({ queryKey: ["stats", "worker", user?.id] });
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col text-slate-800">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Available Tasks</h2>
                    <p className="text-xs text-slate-500">Find micro-tasks and earn rewards</p>
                </div>

                <select
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none hover:border-slate-300 shadow-sm transition-all"
                    onChange={(e) => setSortBy(e.target.value as any)}
                    disabled={isSubmitting}
                >
                    <option value="latest">Latest First</option>
                    <option value="highest_reward">Highest Reward</option>
                </select>
            </div>

            {/* TASK LIST */}
            <div ref={parentRef} className="flex-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm scrollbar-hide">
                <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const task = tasks[virtualRow.index];
                        const activePhase = task.phases[task.activePhaseIndex];
                        const isLockedByDrip = task.drip_feed?.enabled && task.submissions_count >= task.availableSlots;

                        return (
                            <div
                                key={task.id}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                className={`absolute left-0 top-0 w-full px-5 py-4 border-b border-slate-200 flex items-center justify-between transition 
                                    ${isLockedByDrip ? 'opacity-50 grayscale bg-slate-50 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer active:bg-blue-100'}`}
                                onClick={() => !isLockedByDrip && !isSubmitting && setSelectedTask(task)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold shadow-sm">
                                        {task.title[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                                                Phase {task.activePhaseIndex + 1}: {activePhase.phase_name}
                                            </span>
                                            {isLockedByDrip && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100 flex items-center gap-1">
                                                    <Clock size={10} /> Next batch in {task.nextReleaseIn}m
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 line-clamp-1">{activePhase.instructions}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <div className="text-emerald-600 font-black text-lg flex items-center">
                                        <DollarSign size={16} />{activePhase.reward.toFixed(2)}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 px-2 py-1 rounded">
                                        {activePhase.slots - (task.submissions_count % activePhase.slots)} slots left
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SUBMISSION PANEL / DRAWER */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => !isSubmitting && setSelectedTask(null)}
                    />

                    {/* Panel */}
                    <div className={`relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300`}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Submit Evidence</h2>
                                <p className="text-xs text-slate-500 mt-1">Complete the steps below</p>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                disabled={isSubmitting}
                                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors disabled:opacity-30"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Task Summary Card */}
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> {selectedTask.title}
                                </h3>
                                <p className="text-xs text-blue-700 mt-2 leading-relaxed opacity-80">
                                    {selectedTask.details || "Follow instructions carefully to ensure your reward."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Submission Form</span>
                                </div>

                                <div className={`relative transition-all ${isSubmitting ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
                                    <DynamicForm
                                        fields={getFieldsForTask(selectedTask)}
                                        onSubmit={handleSubmit}
                                        buttonTitle={isSubmitting ? "Processing..." : "Submit Task"}
                                        className="gap-5"
                                        buttonClassName={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 
                                            ${isSubmitting
                                                ? 'bg-slate-400 text-white cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'}`}
                                    />

                                    {isSubmitting && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 rounded-xl">
                                            <Loader2 size={32} className="text-blue-600 animate-spin" />
                                            <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-tighter">Uploading Evidence...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 border-t bg-slate-50 text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-medium">
                                Once submitted, our admin will review your evidence. Rewards are credited upon approval.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}