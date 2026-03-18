"use client";
import React, { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    flexRender,
    ColumnDef
} from "@tanstack/react-table";
import {
    Search, Plus, X, Trash2, Edit, ChevronDown,
    ChevronRight, Upload, Zap, Layers, Repeat,
    Download,
    FileSpreadsheet
} from "lucide-react";
import { getTasks, createTask, updateTask, deleteTask, bulkCreateTasks } from "@/app/services/taskService";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { toast } from "@/app/components/ui/toast/use-toast";
import BaseModal from "@/app/components/shared/modals/BaseModal";

// --- SCHEMA ---
const taskSchema = z.object({
    title: z.string().min(5),
    task_type: z.enum(["Social Media Posting", "Email Sending", "Social Media Liking"]),
    campaign_id: z.string().min(1),
    description: z.string().optional(),
    allow_multiple_submissions: z.boolean().default(false),
    drip_feed: z.object({
        enabled: z.boolean().default(false),
        amount: z.number().min(1).default(5),
        interval: z.number().min(0.01).default(1),
    }),
    phases: z.array(z.object({
        phase_name: z.string().min(1),
        slots: z.number().min(1),
        instructions: z.string().min(5),
        reward: z.number().min(0.01),
    })).min(1),
});

const DEFAULT_TASK_VALUES = {
    title: "",
    task_type: "Social Media Posting" as const,
    campaign_id: "",
    description: "",
    allow_multiple_submissions: false,
    drip_feed: { enabled: false, amount: 5, interval: 1 },
    phases: [{ phase_name: "Phase 1", slots: 10, instructions: "", reward: 0.5 }],
};

export default function TasksScreen() {
    const queryClient = useQueryClient();
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: tasks = [], isLoading } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

    const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: DEFAULT_TASK_VALUES
    });

    const isDripEnabled = watch("drip_feed.enabled");
    const { fields, append, remove } = useFieldArray({ control, name: "phases" });

    // --- TABLE COLUMNS ---
    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            id: 'expander',
            header: () => null,
            cell: ({ row }) => (
                <button onClick={row.getToggleExpandedHandler()} className="p-1 hover:bg-slate-100 rounded">
                    {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            ),
        },
        {
            accessorKey: "title",
            header: "Task Details",
            cell: ({ row }) => (
                <div className="py-1">
                    <div className="font-bold text-slate-800">{row.original.title}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                        <Layers size={10} /> {row.original.campaign_id} • {row.original.task_type}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "allow_multiple_submissions",
            header: "Multiple",
            cell: ({ getValue }) => getValue() ?
                <span className="flex items-center gap-1 text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full w-fit"><Repeat size={10} /> YES</span> :
                <span className="text-slate-300 text-[10px] font-bold px-2 py-0.5">NO</span>
        },
        {
            id: "drip",
            header: "Drip Status",
            cell: ({ row }) => row.original.drip_feed?.enabled ? (
                <div className="flex flex-col">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full w-fit ${row.original.dripStatus === 'Waiting' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {row.original.dripStatus}
                    </span>
                    {row.original.dripStatus === 'Waiting' && <span className="text-[9px] text-slate-400 mt-0.5">Next: {row.original.nextReleaseIn}m</span>}
                </div>
            ) : <span className="text-slate-300">-</span>
        },
        {
            id: "progress",
            header: "Progress",
            cell: ({ row }) => (
                <div className="min-w-[120px]">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all"
                            style={{ width: `${Math.min(100, (row.original.submissions_count / row.original.totalSlots) * 100)}%` }}
                        />
                    </div>
                    <div className="text-[10px] mt-1 text-slate-500 font-medium">
                        {row.original.submissions_count} / {row.original.totalSlots} <span className="text-slate-300 ml-1">SLOTS</span>
                    </div>
                </div>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <button onClick={() => openComposer(row.original)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(row.original.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
            )
        }
    ], []);

    const table = useReactTable({
        data: tasks,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
    });

    // --- LOGIC ---
    const openComposer = (task: any = null) => {
        if (task) {
            setEditingTask(task);
            reset(task);
        } else {
            setEditingTask(null);
            reset(DEFAULT_TASK_VALUES);
        }
        setIsComposerOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this task?")) {
            await deleteTask(id);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast({ title: "Deleted", description: "Task removed successfully" });
        }
    };

    const saveMutation = useMutation({
        mutationFn: (data: any) => editingTask ? updateTask(editingTask.id, data) : createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setIsComposerOpen(false);
            setEditingTask(null);
            toast({ title: "Success", description: "Task updated" });
        }
    });

    const handleDownloadTemplate = () => {
        const template = [
            {
                title: "Example Task 1",
                task_type: "Social Media Posting",
                campaign_id: "CAMP-001",
                description: "Short description here",
                allow_multiple_submissions: false,
                drip_feed: { enabled: true, amount: 5, interval: 1 },
                phases: [
                    { phase_name: "Phase 1", slots: 20, instructions: "Post on X", reward: 1.5 }
                ]
            }
        ];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "task_template.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const json = JSON.parse(ev.target?.result as string);
                bulkMutation.mutate(Array.isArray(json) ? json : [json]);
                setIsBulkModalOpen(false);
            } catch (err) {
                toast({ variant: "destructive", title: "Invalid File", description: "Please upload a valid JSON template." });
            }
        };
        reader.readAsText(file);
    };

    const bulkMutation = useMutation({
        mutationFn: bulkCreateTasks,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast({ title: "Bulk Upload Success", description: "All tasks have been added." });
        }
    });


    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Task Management</h2>
                    <p className="text-sm text-slate-500">Configure and monitor your active campaigns</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter tasks..."
                            value={globalFilter}
                            onChange={e => setGlobalFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    {/* Updated Bulk Upload Button */}
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-slate-600"
                    >
                        <Upload size={18} /> <span className="hidden sm:inline">Bulk</span>
                    </button>
                    <button onClick={() => openComposer()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm shadow-blue-200">
                        <Plus size={18} /> Create Task
                    </button>
                </div>
            </div>

            {/* TanStack Table Section */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm table-fixed">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header, idx) => (
                                    <th key={header.id}
                                        style={{ width: idx === 0 ? '50px' : 'auto' }}
                                        className="p-4 font-semibold uppercase text-[10px] tracking-wider">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {table.getRowModel().rows.map(row => (
                            <React.Fragment key={row.id}>
                                <tr className="hover:bg-slate-50/80 transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr className="bg-slate-50/40">
                                        {/* FIX: Start exactly below task detail (skip first cell) */}
                                        <td className="p-0" />
                                        <td colSpan={table.getAllColumns().length - 1} className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {row.original.phases.map((phase: any, idx: number) => (
                                                    <div key={idx} className={`p-4 rounded-xl border bg-white shadow-sm transition-all ${idx === row.original.activePhaseIndex ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex flex-col">
                                                                {idx === row.original.activePhaseIndex && (<p className="text-xs font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md border border-emerald-100 my-1">In Progress</p>)}
                                                                <span className="text-xs font-bold text-blue-600 uppercase">{phase.phase_name}</span>
                                                            </div>
                                                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                                                ${phase.reward}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-2 italic">"{phase.instructions}"</p>
                                                        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Target Slots</span>
                                                            <span className="text-[10px] font-bold text-slate-700">{phase.slots}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* BULK UPLOAD MODAL */}
            <BaseModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                containerClassName="max-w-md"
            >
                <div className="p-2">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <FileSpreadsheet size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Bulk Task Upload</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Upload multiple tasks at once. We recommend downloading our template to ensure your data format is correct.
                    </p>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleDownloadTemplate}
                            className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white"><Download size={18} className="text-slate-600" /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Download Template</p>
                                    <p className="text-[10px] text-slate-400">JSON format with example phases</p>
                                </div>
                            </div>
                        </button>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                        >
                            <Upload className="text-slate-300 group-hover:text-blue-500 mb-2" size={32} />
                            <p className="text-sm font-medium text-slate-600">Click to upload or drag & drop</p>
                            <p className="text-[10px] text-slate-400 mt-1">Accepts .json files</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={handleBulkFileChange}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setIsBulkModalOpen(false)}
                            className="text-sm font-bold text-slate-400 hover:text-slate-600 px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </BaseModal>

            {/* COMPOSER DRAWER */}
            {isComposerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end !mt-0">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsComposerOpen(false)} />
                    <form
                        onSubmit={handleSubmit(data => saveMutation.mutate(data))}
                        className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold">{editingTask ? "Edit Task" : "Create New Task"}</h3>
                                <p className="text-xs text-slate-500 mt-1">Configure your task behavioral rules and phases</p>
                            </div>
                            <button type="button" onClick={() => setIsComposerOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* General Info */}
                            <section className="space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2">1. General Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-700">Task Title</label>
                                        <input {...register("title")} className="w-full mt-1.5 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                                        {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title.message}</p>}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Type</label>
                                        <select {...register("task_type")} className="w-full mt-1.5 p-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all">
                                            <option>Social Media Posting</option>
                                            <option>Email Sending</option>
                                            <option>Social Media Liking</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Campaign ID</label>
                                        <input {...register("campaign_id")} className="w-full mt-1.5 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" />
                                    </div>
                                </div>
                            </section>

                            {/* Behavioral Rules */}
                            <section className="space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2">2. Behavioral Rules</h4>

                                {/* New Field: Allow Multiple Submissions */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-blue-600"><Repeat size={18} /></div>
                                        <div>
                                            <p className="text-sm font-bold">Allow Multiple Submissions</p>
                                            <p className="text-[10px] text-slate-500">Enable if workers can complete this task more than once</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        {...register("allow_multiple_submissions")}
                                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                                    />
                                </div>

                                {/* Drip Feed */}
                                <div className={`p-4 rounded-xl border transition-all ${isDripEnabled ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg border ${isDripEnabled ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}><Zap size={18} /></div>
                                            <div>
                                                <p className="text-sm font-bold">Drip Feed Mechanism</p>
                                                <p className="text-[10px] text-slate-500">Release slots in controlled batches over time</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" {...register("drip_feed.enabled")} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                                    </div>
                                    {isDripEnabled && (
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <label className="text-[10px] font-black text-blue-600 uppercase">Amount per batch</label>
                                                <input type="number" {...register("drip_feed.amount", { valueAsNumber: true })} className="w-full mt-1 p-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-blue-600 uppercase">Interval (Hours)</label>
                                                <input type="number" step="0.01" {...register("drip_feed.interval", { valueAsNumber: true })} className="w-full mt-1 p-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Phases */}
                            <section className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3. Task Phases</h4>
                                    <button type="button" onClick={() => append({ phase_name: `Phase ${fields.length + 1}`, slots: 10, instructions: "", reward: 0.5 })} className="text-blue-600 text-xs font-bold hover:underline">+ Add Phase</button>
                                </div>
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-4 relative group">
                                            <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="pr-8">
                                                <input {...register(`phases.${index}.phase_name`)} className="font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full text-base" placeholder="Phase Name (e.g. Engagement Phase)" />
                                            </div>
                                            <textarea {...register(`phases.${index}.instructions`)} className="w-full p-3 text-sm border border-slate-100 bg-slate-50 rounded-lg outline-none focus:bg-white focus:border-blue-200 transition-all" rows={2} placeholder="Write instructions for the worker..." />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Required Slots</label>
                                                    <input type="number" {...register(`phases.${index}.slots`, { valueAsNumber: true })} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Reward Amount ($)</label>
                                                    <input type="number" step="0.01" {...register(`phases.${index}.reward`, { valueAsNumber: true })} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="p-6 border-t bg-slate-50 flex gap-3">
                            <button type="button" onClick={() => setIsComposerOpen(false)} className="flex-1 bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Discard</button>
                            <button type="submit" disabled={saveMutation.isPending} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:bg-slate-300">
                                {saveMutation.isPending ? "Saving..." : editingTask ? "Update Campaign" : "Launch Campaign"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}