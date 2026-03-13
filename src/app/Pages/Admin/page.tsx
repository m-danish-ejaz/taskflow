"use client";
import { FC, useState } from "react";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import { DynamicFormProps } from "@/app/components/ui/DynamicForm/models/DynamicFormProps";
import { login, signup } from "@/app/services/authService";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner/loadingSpinner";
import { delay } from "@/app/lib/delay";

const AdminDashboard: FC = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-white text-black">
            This is Admin Dashboard
        </div >
    );
};

export default AdminDashboard;