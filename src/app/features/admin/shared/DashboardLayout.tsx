"use client";
import Header from "@/app/features/admin/shared/Header";
import Sidebar from "@/app/features/admin/shared/Sidebar";
import { UserData } from "@/app/hooks/useAuth";
import { useState, ReactNode, Dispatch, SetStateAction } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    menuItems: any[];
    user: UserData;
    logout: () => void;
}

export default function DashboardLayout({ children, activeTab, setActiveTab, menuItems, user, logout }: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Backdrop overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                menuItems={menuItems}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Header toggleMobile={() => setIsMobileOpen(true)} user={user} logout={logout} />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
