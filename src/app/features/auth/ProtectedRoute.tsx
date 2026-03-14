"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("admin" | "worker")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                router.replace("/Pages/Dashboard");
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner />
            </div>
        );
    }
    return <>{children}</>;
}