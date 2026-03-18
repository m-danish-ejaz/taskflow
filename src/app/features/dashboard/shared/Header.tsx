"use client";
import { useState } from "react";
import { Menu, User, LogOut, Settings, UserIcon } from "lucide-react";
import { UserData } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/app/services/dashboardService";

interface HeaderProps {
    toggleMobile: () => void;
    user: UserData | null;
    logout: () => void;
    setActiveTab: (tab: string) => void;
}

export default function Header({ toggleMobile, user, logout, setActiveTab }: HeaderProps) {
    const router = useRouter();

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const { data: stats } = useQuery({
        queryKey: ["stats", "worker", user?.id],
        queryFn: () => getDashboardStats("worker", user?.id),
        enabled: user?.role === 'worker'
    });
    
    return (
        <header className="h-16 bg-white border-b border-slate-300 flex items-center justify-between px-4 lg:px-6 z-30">
            <div className="flex items-center">
                <button
                    onClick={toggleMobile}
                    className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-50 transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                {user?.role === 'worker' && (
                    <div className="mr-4 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Balance</span>
                        <span className="text-sm font-black text-emerald-700">
                            ${stats?.totalEarnings?.toFixed(2) || "0.00"}
                        </span>
                    </div>
                )}
                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-50 transition-colors border border-transparent"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                            {getInitials(user?.name)}
                        </div>

                        <span className="hidden sm:block text-sm font-medium text-slate-700 pr-1 capitalize">
                            {user?.name.split(' ')[0]}
                        </span>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                            <div className="px-4 py-3 border-b border-slate-200">
                                <p className="text-sm font-medium text-slate-800 capitalize">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">
                                    {user?.role}
                                </span>
                            </div>
                            <div className="py-1">
                                <button
                                    className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    onClick={() => {
                                        setActiveTab("settings");
                                        setIsProfileOpen(false);
                                    }}>
                                    <UserIcon size={16} className="mr-3" /> My Profile
                                </button>
                            </div>
                            <div className="border-t border-slate-200 py-1">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} className="mr-3" /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}