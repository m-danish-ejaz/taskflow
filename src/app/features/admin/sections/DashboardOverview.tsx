import { Activity, ArrowDownRight, ArrowUpRight, DollarSign, Users } from "lucide-react";

export default function DashboardOverview(){
    const stats = [
        { title: "Total Revenue", value: "$45,231.89", trend: "+20.1%", isUp: true, icon: DollarSign },
        { title: "Active Users", value: "2,350", trend: "+15.2%", isUp: true, icon: Users },
        { title: "Bounce Rate", value: "12.5%", trend: "-4.1%", isUp: false, icon: Activity },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`flex items-center font-medium ${stat.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                                {stat.trend}
                            </span>
                            <span className="text-slate-400 ml-2">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Chart Area Mock */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex items-center justify-center flex-col">
                <Activity size={48} className="text-blue-200 mb-4" />
                <p className="text-slate-500 font-medium">Chart Visualization Area</p>
            </div>
        </div>
    );
};