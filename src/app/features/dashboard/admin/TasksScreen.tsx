"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    useReactTable, getCoreRowModel, getExpandedRowModel, getFilteredRowModel,
    getSortedRowModel, flexRender, ColumnDef
} from "@tanstack/react-table";
import { Search, Plus, X, Trash2, Edit, ChevronDown, ChevronRight } from "lucide-react";

import { getTasks, createTask, updateTask, deleteTask } from "@/app/services/taskService";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { FormInput } from "@/app/Models/FormInputs";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import BaseModal from "@/app/components/shared/modals/BaseModal";

const inputClass = "w-full mt-1 px-3 bg-transparent py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900";
const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider";
const taskFields: FormInput[] = [
    {
        modelName: "task_type",
        label: "Task Type",
        type: "select",
        options: [
            { label: "Social Media Posting", value: "Social Media Posting" },
            { label: "Email Sending", value: "Email Sending" },
            { label: "Social Media Liking", value: "Social Media Liking" }
        ],
        validators: [{ type: "required", message: "Task type is required" }],
        labelClass,
        inputClass
    },
    {
        modelName: "campaign_id",
        label: "Campaign ID",
        type: "text",
        placeholder: "e.g. Q1-Marketing",
        validators: [{ type: "required", message: "Campaign ID required" }],
        labelClass, inputClass
    },
    {
        modelName: "title",
        label: "Title",
        type: "text",
        placeholder: "Task Title",
        validators: [
            { type: "required", message: "Title is required" },
            { type: "minLength", value: 5, message: "Min 5 characters" }
        ],
        labelClass, inputClass
    },
    {
        modelName: "description",
        label: "Short Description",
        type: "text",
        placeholder: "Brief summary...",
        labelClass, inputClass
    },
    {
        modelName: "details",
        label: "Full Details (Instructions)",
        type: "textarea",
        placeholder: "Detailed instructions for the worker...",
        validators: [
            { type: "required", message: "Provide detailed instructions" },
            { type: "minLength", value: 10, message: "Min 10 characters" }
        ],
        labelClass, inputClass
    },
    {
        modelName: "amount",
        label: "Amount Needed",
        type: "number",
        wrapperClass: "col-span-1",
        validators: [{ type: "required", message: "Amount is required" }],
        labelClass, inputClass
    },
    {
        modelName: "reward",
        label: "Reward (AUD)",
        type: "number",
        wrapperClass: "col-span-1",
        validators: [{ type: "required", message: "Reward is required" }],
        labelClass, inputClass
    },
    {
        modelName: "allow_multiple_submissions",
        label: "Allow multiple submissions per worker",
        type: "checkbox",
        labelClass: "ml-2 text-sm text-slate-700 cursor-pointer",
        inputClass: "h-6 w-auto bg-transparent text-blue-600 rounded cursor-pointer",
        wrapperClass: "flex items-center pt-2"
    }
];


// --- 1. ZOD SCHEMA FOR COMPOSER ---
const taskSchema = z.object({
    task_type: z.enum(["Social Media Posting", "Email Sending", "Social Media Liking"], {
        message: "Task type is required",
    }),
    title: z.string().min(5, "Title > 5 chars"),
    description: z.string().optional(),
    details: z.string().min(10, "Provide detailed instructions"),
    amount: z.number().min(1),
    reward: z.number().min(0.1),
    allow_multiple_submissions: z.boolean(),
    campaign_id: z.string().min(1, "Campaign ID required"),
});
type TaskFormValues = z.infer<typeof taskSchema>;

export default function TasksScreen() {
    const queryClient = useQueryClient();

    // UI States
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any | null>(null);

    // Table States
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

    // --- 2. DATA FETCHING & MUTATIONS ---
    const { data: tasks = [], isLoading } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
    });

    const saveTaskMutation = useMutation({
        mutationFn: async (data: TaskFormValues) => {
            if (editingTask) return updateTask(editingTask.id, data);
            return createTask(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            closeComposer();
        }
    });

    // --- 3. COMPOSER FORM SETUP ---
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: { allow_multiple_submissions: false, amount: 1, reward: 1.0 }
    });

    // Populate form when editing
    useEffect(() => {
        if (editingTask) reset(editingTask);
        else reset({ task_type: undefined, title: "", description: "", details: "", amount: 1, reward: 1.0, campaign_id: "", allow_multiple_submissions: false });
    }, [editingTask, reset]);

    const openComposer = (task: any = null) => {
        setEditingTask(task);
        setIsComposerOpen(true);
    };

    const closeComposer = () => {
        setIsComposerOpen(false);
        setTimeout(() => setEditingTask(null), 300);
    };

    const handleFormSubmit = async (data: any) => {
        const formattedData = {
            ...data,
            amount: Number(data.amount),
            reward: Number(data.reward)
        };
        saveTaskMutation.mutate(formattedData);
    };
    
    const confirmDelete = () => {
        if (deleteModal.id) {
            deleteMutation.mutate(deleteModal.id);
            setDeleteModal({ isOpen: false, id: null });
        }
    };
    // --- 4. TABLE COLUMNS ---
    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            header: ({ table }) => (<input type="checkbox" className="w-4 h-4 rounded" checked={table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />),
            cell: ({ row }) => (<input type="checkbox" className="w-4 h-4 rounded" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
            ),
        },

        {
            accessorKey: "title",
            header: "Title",
            cell: info => <span className="font-medium text-slate-800">{info.getValue() as string}</span>
        },
        { accessorKey: "task_type", header: "Type" },
        { accessorKey: "campaign_id", header: "Campaign" },
        {
            id: "progress", header: "Submissions", cell: ({ row }) => {
                const count = row.original.submissions_count || 0;
                const amount = row.original.amount;
                return (
                    <div className="flex flex-col gap-1 w-24">
                        <span className="text-xs text-slate-500">{count} / {amount}</span>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full" style={{ width: `${Math.min((count / amount) * 100, 100)}%` }} />
                        </div>
                    </div>
                );
            }
        },
        { accessorKey: "reward", header: "Reward", cell: info => <span className="text-emerald-600 font-medium">${(info.getValue() as number).toFixed(2)}</span> },
        { accessorKey: "status", header: "status", cell: info => <span> {info.getValue() as string} </span> },
        {
            id: "actions", header: "Actions", cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => openComposer(row.original)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                    <button onClick={() => setDeleteModal({ isOpen: true, id: row.original.id })} className="p-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-red-100 hover:text-red-600">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: tasks, columns, state: { rowSelection, globalFilter },
        onRowSelectionChange: setRowSelection, onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(), getExpandedRowModel: getExpandedRowModel(),
    });

    const selectedIds = Object.keys(rowSelection).map(index => tasks[Number(index)]?.id).filter(Boolean);
    const inputClass = "w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900";
    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="relative h-full flex flex-col space-y-4 ">
            {deleteModal.isOpen && (
                <BaseModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, id: null })}
                    containerClassName="max-w-md border-t-4 border-red-500"
                >
                    <h3 className="font-bold text-lg">Are you sure?</h3>
                    <p className="text-sm text-slate-600">This action cannot be undone.</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setDeleteModal({ isOpen: false, id: null })}>Cancel</button>
                        <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                    </div>
                </BaseModal>
            )}
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center bg-white px-3 py-1 rounded-lg border border-slate-200 flex-1 sm:w-64">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none shadow-none text-sm text-black w-full"
                        />                    </div>
                    <button onClick={() => openComposer()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap">
                        <Plus size={18} className="mr-1" /> Create Task
                    </button>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            {table.getHeaderGroups().map(hg =>
                                <tr key={hg.id}>
                                    {hg.headers.map(h =>
                                        <th key={h.id} className="px-4 py-3 font-semibold">
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </th>
                                    )}
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {table.getRowModel().rows.map(row => (
                                <React.Fragment key={row.id}>
                                    <tr className={`hover:bg-slate-50 transition-colors ${row.getIsSelected() ? 'bg-blue-50/50' : ''}`}>
                                        {row.getVisibleCells().map(cell =>
                                            <td key={cell.id} className="px-4 py-3 text-slate-700">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        )}
                                    </tr>
                                </React.Fragment>
                            ))}
                            {table.getRowModel().rows.length === 0 &&
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                                        No tasks found. Create one!
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- SLIDE-OVER COMPOSER (SHEET) --- */}
            {isComposerOpen && <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-sm transition-opacity !mt-0" onClick={closeComposer} />}
            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col !mt-0 ${isComposerOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {editingTask ? "Edit Task" : "Create New Task"}
                    </h3>
                    <button onClick={closeComposer} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <DynamicForm
                        fields={taskFields.map(f => ({
                            ...f,
                            value: editingTask ? editingTask[f.modelName] : f.value
                        }))}
                        onSubmit={handleFormSubmit}
                        buttonTitle={editingTask ? "Save Changes" : "Create Task"}
                        className="space-y-4"
                        buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-md font-medium text-white py-2.5 rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}