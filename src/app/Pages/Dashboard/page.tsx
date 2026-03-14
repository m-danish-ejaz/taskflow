"use client";
import { useState } from "react";
import DashboardLayout from "@/app/features/dashboard/shared/DashboardLayout";
import DashboardOverview from "@/app/features/dashboard/shared/DashboardOverview";
import { LayoutDashboard, LayoutList, UserRound, ListChecks } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import ProtectedRoute from "@/app/features/auth/ProtectedRoute";
import TasksScreen from "@/app/features/dashboard/admin/TasksScreen";
import TaskFeed from "@/app/features/dashboard/worker/TaskFeed";
import SubmissionsScreen from "@/app/features/dashboard/admin/SubmissionsScreen";
import WorkersScreen from "@/app/features/dashboard/admin/WorkersScreen";
import ProfileSettings from "@/app/features/dashboard/shared/ProfileSettings";
import WorkerSubmissionsScreen from "@/app/features/dashboard/worker/WorkerSubmissionsScreen";

export default function Page() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");

    // Admin Tabs
    const adminMenu = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "tasks", label: "Tasks", icon: LayoutList },
        { id: "submissions", label: "Submissions", icon: ListChecks },
        { id: "workers", label: "Workers", icon: UserRound },
    ];

    // Worker Tabs
    const workerMenu = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "tasks", label: "Tasks", icon: LayoutList },
        { id: "submissions", label: "My Submissions", icon: ListChecks },
    ];

    const menuItems = user?.role === "admin" ? adminMenu : workerMenu;

    // Separate what renders based on role!
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return user?.role === "admin"
                    ? <DashboardOverview role="admin" workerId={user?.id} />
                    : <DashboardOverview role="worker" workerId={user?.id} />;
            case "tasks":
                return user?.role === "admin"
                    ? <TasksScreen />
                    : <TaskFeed />;

            case "submissions":
                return user?.role === "admin"
                    ? <SubmissionsScreen />
                    : <WorkerSubmissionsScreen workerId={user?.id ?? ""} />;

            // Admin Only Tabs
            case "workers":
                return <WorkersScreen />;
            case "settings":
                return <ProfileSettings user={user!} />;

            default:
                return user?.role === "admin"
                    ? <DashboardOverview role="admin" workerId={user?.id} />
                    : <DashboardOverview role="worker" workerId={user?.id} />;
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