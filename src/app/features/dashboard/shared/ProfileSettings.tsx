"use client";
import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/app/services/userService";
import { toast } from "@/app/components/ui/toast/use-toast";
import { UserData } from "@/app/hooks/useAuth";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import { FormInput } from "@/app/Models/FormInputs";

interface ProfileSettingsProps { user: UserData; }

export default function ProfileSettings({ user }: ProfileSettingsProps) {
    const queryClient = useQueryClient();

    const fields: FormInput[] = useMemo(() => [
        {
            modelName: "name",
            label: "Full Name",
            type: "text",
            value: user.name,
            validators: [{ type: "required", message: "Name is required" }],
            wrapperClass: "w-full",
            labelClass: "text-xs font-bold text-slate-500 uppercase tracking-wider",
            inputClass: "w-full mt-1.5 px-4 py-3 text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
        },
        {
            modelName: "email",
            label: "Email Address (Permanent)",
            type: "email",
            value: user.email,
            wrapperClass: "w-full",
            labelClass: "text-xs font-bold text-slate-500 uppercase tracking-wider",
            // Styled as read-only/disabled
            inputClass: "w-full mt-1.5 px-4 py-3 text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed italic shadow-inner"
        },
        {
            modelName: "password",
            label: "Update Password",
            type: "password",
            placeholder: "Leave empty to keep current password",
            wrapperClass: "w-full",
            labelClass: "text-xs font-bold text-slate-500 uppercase tracking-wider",
            inputClass: "w-full mt-1.5 px-4 py-3 text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
        }
    ], [user]);

    const mutation = useMutation({
        mutationFn: (data: any) => updateProfile(user.email, data),
        onSuccess: (updatedUser) => {
            const session = JSON.parse(localStorage.getItem("active_session") || "{}");
            localStorage.setItem("active_session", JSON.stringify({ ...session, user: updatedUser }));

            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });

            // Short delay before reload to let user see toast
            setTimeout(() => window.location.reload(), 1000);
        }
    });

    return (
        <div className="min-h-full flex items-start justify-center p-4">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-800">Account Settings</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your public profile and account security.</p>
                </div>

                <DynamicForm
                    fields={fields}
                    onSubmit={(data) => mutation.mutate(data)}
                    buttonTitle={mutation.isPending ? "Saving..." : "Update Profile"}
                    buttonClassName={`w-full mt-4 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${mutation.isPending
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]"
                        }`}
                    className="flex flex-col gap-6"
                />
            </div>
        </div>
    );
}