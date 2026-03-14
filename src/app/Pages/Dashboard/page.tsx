"use client";
import { useState } from "react";
import DashboardLayout from "@/app/features/dashboard/shared/DashboardLayout";
import DashboardOverview from "@/app/features/dashboard/admin/DashboardOverview";
// import WorkerOverview from "@/app/features/dashboard/worker/WorkerOverview"; <--- Import your worker dashboard here
import { LayoutDashboard, LayoutList, UserRound, Settings, ListChecks } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import ProtectedRoute from "@/app/features/auth/ProtectedRoute";
import TasksScreen from "@/app/features/dashboard/admin/TasksScreen";

export default function Page() {
    const { user, logout } = useAuth();
    const[activeTab, setActiveTab] = useState("dashboard");

    // Admin Tabs
    const adminMenu =[
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "tasks", label: "Tasks", icon: LayoutList },
        { id: "submissions", label: "Submissions", icon: ListChecks },
        { id: "workers", label: "Workers", icon: UserRound },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    // Worker Tabs
    const workerMenu =[
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "tasks", label: "My Tasks", icon: LayoutList },
        { id: "submissions", label: "My Submissions", icon: ListChecks },
    ];

    const menuItems = user?.role === "admin" ? adminMenu : workerMenu;

    // Separate what renders based on role!
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return user?.role === "admin" 
                    ? <DashboardOverview /> 
                    : <div className="text-2xl font-bold text-slate-800">Worker Overview Component Goes Here</div>; // Replace with <WorkerOverview />

            case "tasks":
                return user?.role === "admin"
                    ? <TasksScreen />
                    : <div className="text-2xl font-bold text-slate-800">Worker's Assigned Tasks</div>;

            case "submissions":
                return user?.role === "admin"
                    ? <div className="text-2xl font-bold text-slate-800">Review All Submissions</div>
                    : <div className="text-2xl font-bold text-slate-800">My Personal Submissions</div>;

            // Admin Only Tabs
            case "workers":
                return <div className="text-2xl font-bold text-slate-800">Workers Management</div>;
            case "settings":
                return <div className="text-2xl font-bold text-slate-800">System Settings</div>;
            
            default:
                return user?.role === "admin" 
                    ? <DashboardOverview /> 
                    : <div className="text-2xl font-bold text-slate-800">Worker Overview Component Goes Here</div>;
        }
    };

    return (
        <ProtectedRoute allowedRoles={["admin", "worker"]}>
            <DashboardLayout 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                menuItems={menuItems} 
                user={user} 
                logout={logout}
            >
                {renderContent()}
            </DashboardLayout>
        </ProtectedRoute>
    );
}