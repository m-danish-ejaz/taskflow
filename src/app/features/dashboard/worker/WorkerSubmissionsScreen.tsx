"use client";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "@/app/services/submissionService";
import { getAllRecords } from "@/app/lib/db";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";

export default function WorkerSubmissionsScreen({ workerId }: { workerId: string }) {
    // 1. Fetch data
    const { data: submissions = [], isLoading: isLoadingSub } = useQuery({
        queryKey: ["submissions"],
        queryFn: getSubmissions,
    });
    const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: () => getAllRecords("tasks") });

    // 2. Memoize filtered data
    const tableData = useMemo(() => {
        return submissions
            .filter((sub: any) => sub.worker_id === workerId)
            .map((sub: any) => ({
                ...sub,
                taskDetails: tasks.find((t: any) => t.id === sub.task_id)?.details || "N/A"
            }));
    }, [submissions, tasks, workerId]);

    // 3. Define columns
    const columns: ColumnDef<any>[] = [
        { accessorKey: "taskDetails", header: "Task" },
        {
            accessorKey: "status",
            header: "Status",
            cell: info => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${info.getValue() === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        info.getValue() === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {info.getValue() as string}
                </span>
            )
        },
        {
            accessorKey: "reason",
            header: "Admin Note",
            cell: info => <span className="text-xs text-slate-500">{info.getValue() as string || "N/A"}</span>
        }
    ];

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoadingSub) return <LoadingSpinner />;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Submissions</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-800">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} className="p-4">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
                        ))}
                    </thead>
                    <tbody className="divide-y">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => <td key={cell.id} className="p-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}