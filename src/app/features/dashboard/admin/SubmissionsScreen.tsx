"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubmissions, updateSubmissionStatus } from "@/app/services/submissionService";
import { deleteRecord, getAllRecords } from "@/app/lib/db";
import { Check, X, Trash2 } from "lucide-react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";

export default function SubmissionsScreen() {
    const queryClient = useQueryClient();
    const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const [reason, setReason] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

    const { data: submissions = [], isLoading: isLoadingSub } = useQuery({
        queryKey: ["submissions"],
        queryFn: getSubmissions,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: () => getAllRecords("users") });
    const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: () => getAllRecords("tasks") });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteRecord("submissions", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["submissions"], refetchType: 'all' });
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status, reason }: { id: string, status: "approved" | "rejected", reason?: string }) =>
            updateSubmissionStatus(id, status, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["submissions"] });
        }
    });

    const handleApprove = (id: string) => {
        statusMutation.mutate({ id, status: 'approved' })
    };

    const handleRejectClick = (id: string) => {
        setRejectionModal({ isOpen: true, id });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            deleteMutation.mutate(deleteModal.id);
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    const confirmReject = () => {
        if (rejectionModal.id) {
            statusMutation.mutate({ id: rejectionModal.id, status: 'rejected', reason });
            setRejectionModal({ isOpen: false, id: null });
            setReason("");
        }
    };

    const tableData = submissions.map((sub: any) => ({
        ...sub,
        workerName: users.find((u: any) => u.id === sub.worker_id)?.name || "Unknown",
        taskDetails: tasks.find((t: any) => t.id === sub.task_id)?.details || "N/A"
    }));

    const columns: ColumnDef<any>[] = [
        { accessorKey: "workerName", header: "Worker" },
        {
            accessorKey: "taskDetails",
            header: "Instructions",
            cell: info => <div className="max-w-xs truncate text-xs text-slate-500">{info.getValue() as string}</div>
        },
        {
            accessorKey: "content_display",
            header: "Submitted Content",
            cell: ({ row }) => {
                const { post_url, email_content } = row.original;
                if (post_url) {
                    return (
                        <a
                            href={post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs block max-w-[150px] truncate"
                        >
                            View Post
                        </a>
                    );
                }

                return (
                    <div className="text-slate-600 text-xs max-w-[150px] truncate" title={email_content}>
                        {email_content || "No content"}
                    </div>
                );
            }
        },
        {
            accessorKey: "evidence_path",
            header: "Evidence",
            cell: info => {
                const path = info.getValue() as string;
                if (!path) return "None";

                const openInNewTab = () => {
                    const win = window.open();
                    if (win) {
                        win.document.write(`<img src="${path}" style="max-width:100%;" />`);
                    }
                };

                return (
                    <button onClick={openInNewTab}>
                        <img src={path} className="w-12 h-12 object-cover rounded border cursor-pointer hover:opacity-80" alt="Evidence" />
                    </button>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: info => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${info.getValue() === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    info.getValue() === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{info.getValue() as string}</span>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    {row.original.status === 'pending' && (
                        <>
                            <button onClick={() => handleApprove(row.original.id)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Check size={16} /></button>
                            <button onClick={() => handleRejectClick(row.original.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><X size={16} /></button>
                        </>
                    )}
                    <button onClick={() => setDeleteModal({ isOpen: true, id: row.original.id })} className="p-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-red-100 hover:text-red-600">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data: tableData, columns, getCoreRowModel: getCoreRowModel(),
    });

    if (isLoadingSub) return <LoadingSpinner />;

    {/* Rejection Reason Modal */ }
    {
        rejectionModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
                    <h3 className="font-bold text-lg text-slate-800">Reject Submission</h3>
                    <p className="text-sm text-slate-600">Please provide a reason for rejecting this submission.</p>
                    <textarea
                        autoFocus
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                    />
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setRejectionModal({ isOpen: false, id: null })}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmReject}
                            disabled={!reason.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    {/* Delete Confirmation Modal */ }
    {
        deleteModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
                    <h3 className="font-bold text-lg text-slate-800">Delete Submission</h3>
                    <p className="text-sm text-slate-600">Are you sure you want to delete this submission? This action cannot be undone.</p>
                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            onClick={() => setDeleteModal({ isOpen: false, id: null })}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Submissions Review</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-800">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        {table.getHeaderGroups().map(hg => <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} className="p-4 font-semibold">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                {row.getVisibleCells().map(cell => <td key={cell.id} className="p-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}