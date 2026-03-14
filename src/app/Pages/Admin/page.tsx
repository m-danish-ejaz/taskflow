"use client";
import { useState } from "react";
import DashboardLayout from "@/app/features/admin/shared/DashboardLayout";
import DashboardOverview from "@/app/features/admin/sections/DashboardOverview";
import { LayoutDashboard, LayoutList, UserRound, Settings, ListChecks } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import ProtectedRoute from "@/app/features/auth/ProtectedRoute";


// Main Page Component
export default function Page() {
    const { user, logout, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "tasks", label: "Tasks", icon: LayoutList },
        { id: "submissions", label: "Submissions", icon: ListChecks },
        // { id: "campaigns", label: "Campaigns", icon: Settings },
        { id: "workers", label: "Workers", icon: UserRound },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    if (loading || !user) {
        return <div className="h-screen w-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardOverview />;
            case "tasks":
                return <div className="text-2xl font-bold text-slate-800">Task Content</div>;
            case "submissions":
                return <div className="text-2xl font-bold text-slate-800">Submissions Content</div>;
            case "workers":
                return <div className="text-2xl font-bold text-slate-800">Workers Management</div>;
            case "settings":
                return <div className="text-2xl font-bold text-slate-800">System Settings</div>;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} user={user} logout={logout}>
                {renderContent()}
            </DashboardLayout>
        </ProtectedRoute>

    );
}