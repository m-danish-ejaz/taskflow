"use client";
import { Dispatch, SetStateAction } from "react";
import { LayoutDashboard, LayoutList, UserRound, Settings, X, ListChecks, ArrowRightFromLine, ArrowLeftFromLine, BookOpenCheck } from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: Dispatch<SetStateAction<boolean>>;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    isMobileOpen: boolean;
    setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
    menuItems : any[];
}

export default function Sidebar({
    isCollapsed, setIsCollapsed, activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, menuItems}: SidebarProps) {
    return (
        <aside
            className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-300 transition-all duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}
        >
            {/* Brand Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-300 shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 p-1">
                        <BookOpenCheck />
                    </div>
                    {!isCollapsed && <span className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">Task<span className="text-blue-600">Flow</span></span>}
                </div>

                {/* Mobile Close Button */}
                <button className="lg:hidden text-slate-400 hover:text-blue-600 transition-colors" onClick={() => setIsMobileOpen(false)}>
                    <X size={20} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileOpen(false);
                            }}
                            title={isCollapsed ? item.label : undefined}
                            className={`w-full flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200 ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium"} ${isCollapsed ? "justify-center" : "justify-start"}`}>
                            <Icon size={20} className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                            {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Desktop Collapse Toggle */}
            <div className="hidden lg:flex p-4 border-t border-slate-300 shrink-0">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                    <div className="flex items-center gap-2">
                        {!isCollapsed && "Collapse"}
                        {isCollapsed ? <ArrowRightFromLine /> : <ArrowLeftFromLine />}
                    </div>
                </button>
            </div>
        </aside>
    );
}