"use client";
import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getAvailableTasks } from "@/app/services/taskService";
import { DollarSign, Clock, ChevronRight, X } from "lucide-react";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { FormInput } from "@/app/Models/FormInputs";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import { submitTask } from "@/app/services/submissionService";
import { toast } from "@/app/components/ui/toast/use-toast";

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
    const [sortBy, setSortBy] = useState<"latest" | "highest_reward">("latest");
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

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
        try {
            const file = Array.isArray(data.evidence_file) ? data.evidence_file[0] : data.evidence_file;

            if (!(file instanceof File)) throw new Error("No file selected");
            if (file.size > MAX_FILE_SIZE) throw new Error("File is too large (Max 10MB)");

            // Convert to Base64
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
                worker_id: JSON.parse(localStorage.getItem("active_session") || "{}").user?.id,
            };

            await submitTask(submissionPayload);
            toast({ title: "Success", description: "Submission Sent!" });
            setSelectedTask(null);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col text-slate-800">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Available Tasks</h2>

                <select
                    className="bg-white border border-slate-200 rounded-lg px-8 py-2 text-sm outline-none hover:border-slate-300"
                    onChange={(e) => setSortBy(e.target.value as any)}
                >
                    <option value="latest">Sort By Latest</option>
                    <option value="highest_reward">Sort By Highest Reward</option>
                </select>
            </div>

            {/* TASK LIST */}
            <div ref={parentRef} className="flex-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const task = tasks[virtualRow.index];

                        return (
                            <div
                                key={task.id}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                className="absolute left-0 top-0 w-full px-5 py-4 border-b border-slate-200 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between"
                                onClick={() => setSelectedTask(task)}
                            >
                                <div className="flex items-start gap-4">

                                    {/* TASK ICON */}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-semibold text-lg">
                                        {task.title[0]}
                                    </div>

                                    {/* TASK INFO */}
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-slate-900">
                                            {task.title}
                                        </h3>

                                        <p className="text-xs text-blue-600 font-medium">
                                            {task.task_type}
                                        </p>

                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {task.details}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock size={13} />
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </span>

                                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                                <DollarSign size={13} />
                                                ${task.reward.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight className="text-slate-300" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SUBMISSION PANEL */}

            {selectedTask && (
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Submit Evidence</h2>
                        <button onClick={() => setSelectedTask(null)} className="p-2 rounded-md hover:bg-slate-100">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">{selectedTask.title}</h3>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedTask.details}</p>
                    </div>

                    <DynamicForm
                        fields={getFieldsForTask(selectedTask)}
                        onSubmit={handleSubmit}
                        buttonTitle="Submit Task"
                        className="border-t pt-5 gap-5"
                        buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                    />
                </div>
            )}
        </div>
    );
}