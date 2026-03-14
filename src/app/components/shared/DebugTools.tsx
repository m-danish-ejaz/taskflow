"use client";
import { useEffect } from "react";
import { makeUserAdmin } from "@/app/services/authService";

export default function DebugTools() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as any).makeAdmin = (email: string) => {
                makeUserAdmin(email).then(() => {
                    console.log(`Command executed for: ${email}`);
                });
            };
        }

        return () => {
            if (typeof window !== "undefined") {
                delete (window as any).makeAdmin;
            }
        };
    }, []);

    return null;
}