"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRecords } from "@/app/lib/db";
import { deleteUser, updateProfile } from "@/app/services/userService";
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Search, Trash2, Edit, X, User as UserIcon } from "lucide-react";

import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { toast } from "@/app/components/ui/toast/use-toast";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import BaseModal from "@/app/components/shared/modals/BaseModal";
import { FormInput } from "@/app/Models/FormInputs";

const inputClass = "w-full mt-1 px-3 bg-transparent py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900";
const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider";

const userFields: FormInput[] = [
    {
        modelName: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter worker name",
        validators: [{ type: "required", message: "Name is required" }],
        labelClass, inputClass
    },
    {
        modelName: "email",
        label: "Email Address",
        type: "email",
        placeholder: "worker@example.com",
        className: "bg-slate-50 cursor-not-allowed",
        labelClass, inputClass
    },
    {
        modelName: "role",
        label: "Role",
        type: "select",
        options: [
            { label: "Admin", value: "admin" },
            { label: "Worker", value: "worker" },
        ],
        validators: [{ type: "required", message: "Task type is required" }],
        labelClass,
        inputClass
    },
    {
        modelName: "password",
        label: "New Password",
        type: "password",
        placeholder: "Leave blank to keep current",
        labelClass, inputClass
    }
];

export default function WorkersScreen() {
    const queryClient = useQueryClient();

    // UI States
    const [globalFilter, setGlobalFilter] = useState("");
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; email: string | null }>({ isOpen: false, email: null });

    // Identify current user to exclude from list
    const currentUser = useMemo(() => {
        const session = typeof window !== 'undefined' ? localStorage.getItem("active_session") : null;
        return session ? JSON.parse(session).user : null;
    }, []);

    // --- DATA FETCHING ---
    const { data: allUsers = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => getAllRecords("users")
    });

    // --- FILTER LOGIC ---
    // 1. Exclude current logged in user
    // 2. Only show users with role 'worker'
    const workers = useMemo(() => {
        return allUsers.filter((u: any) =>
            u.email !== currentUser?.email && u.role === 'worker'
        );
    }, [allUsers, currentUser]);

    // --- MUTATIONS ---
    const deleteMutation = useMutation({
        mutationFn: (email: string) => deleteUser(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "Deleted", description: "Worker removed successfully." });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => updateProfile(data.email, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "Success", description: "Worker profile updated." });
            closeComposer();
        }
    });

    // --- HANDLERS ---
    const openComposer = (user: any) => {
        setEditingUser(user);
        setIsComposerOpen(true);
    };

    const closeComposer = () => {
        setIsComposerOpen(false);
        setTimeout(() => setEditingUser(null), 300);
    };

    const confirmDelete = () => {
        if (deleteModal.email) {
            deleteMutation.mutate(deleteModal.email);
            setDeleteModal({ isOpen: false, email: null });
        }
    };

    // --- TABLE COLUMNS ---
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Worker Name",
            cell: info => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <UserIcon size={14} />
                    </div>
                    <span className="font-medium text-slate-800">{info.getValue() as string}</span>
                </div>
            )
        },
        { accessorKey: "email", header: "Email Address" },
        {
            accessorKey: "role", header: "Role",
            cell: info => (
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase ${info.getValue() === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {info.getValue() as string}
                </span>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openComposer(row.original)}
                        className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Edit Profile"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => setDeleteModal({ isOpen: true, email: row.original.email })}
                        className="p-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Worker"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: workers,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (isLoading) return <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="relative h-full flex flex-col space-y-4">

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {deleteModal.isOpen && (
                <BaseModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, email: null })}
                    containerClassName="max-w-md border-t-4 border-red-500"
                >
                    <div className="p-2">
                        <h3 className="font-bold text-lg text-slate-800">Remove Worker?</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Are you sure you want to delete <b>{deleteModal.email}</b>? This action is permanent.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, email: null })}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow-md shadow-red-100"
                            >
                                Delete Worker
                            </button>
                        </div>
                    </div>
                </BaseModal>
            )}

            {/* --- HEADER --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Worker Management</h2>
                    <p className="text-slate-500 text-sm">Manage access and profiles for your task workforce.</p>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-xl border border-slate-200 w-72 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="bg-transparent border-none outline-none ml-2 text-sm w-full"
                    />
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            {table.getHeaderGroups().map(hg => (
                                <tr key={hg.id}>{hg.headers.map(h => (
                                    <th key={h.id} className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </th>
                                ))}</tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4 text-slate-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {workers.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        No workers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- SLIDE-OVER COMPOSER --- */}
            {isComposerOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-sm transition-opacity !mt-0" onClick={closeComposer} />
            )}
            <div className={`fixed inset-y-0 right-0 z-50 w-full !mt-0 max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isComposerOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Edit Worker Profile</h3>
                        <p className="text-xs text-slate-500 mt-1">Updating information for {editingUser?.email}</p>
                    </div>
                    <button onClick={closeComposer} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {editingUser && (
                        <DynamicForm
                            fields={userFields.map(f => ({
                                ...f,
                                value: editingUser[f.modelName] || ""
                            }))}
                            onSubmit={(data) => updateMutation.mutate({ ...data, email: editingUser.email })}
                            buttonTitle={updateMutation.isPending ? "Saving..." : "Update Profile"}
                            buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
                            className="gap-6"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}