"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define what your user object looks like
export interface UserData {
    id: string;
    name: string;
    email: string;
    role: "admin" | "worker";
}

export function useAuth() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("active_session");
        setUser(null);
        router.push("/");
    };

    useEffect(() => {
        const sessionStr = localStorage.getItem("active_session");

        if (!sessionStr) {
            router.push("/");
            return;
        }

        try {
            const session = JSON.parse(sessionStr);

            if (Date.now() > session.expiresAt) {
                logout();
            } else {
                setUser(session.user);
                setLoading(false);
                const timeRemaining = session.expiresAt - Date.now();
                const timeoutId = setTimeout(() => {
                    logout();
                }, timeRemaining);

                return () => clearTimeout(timeoutId);
            }
        } catch (error) {
            logout();
        }
    }, [router]);

    return { user, logout, loading };
}