"use client";
import { FC, useEffect, useRef, useState } from "react";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import { DynamicFormProps } from "@/app/components/ui/DynamicForm/models/DynamicFormProps";
import { login, signup } from "@/app/services/authService";
import LoadingSpinner from "@/app/components/shared/loadingSpinner";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/components/ui/toast/toaster";
import { useToast } from "@/app/components/ui/toast/use-toast";
import { delay } from "@/app/lib/db";

const Login: FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const sessionStr = localStorage.getItem("active_session");
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                if (Date.now() < session.expiresAt) {
                    router.replace("/Pages/Dashboard");
                } else {
                    localStorage.removeItem("active_session");
                }
            } catch (e) {
                localStorage.removeItem("active_session");
            }
        }
    }, [router]);

    const inputClass = "w-full mt-1 px-3 bg-transparent py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900";
    const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider";

    const loginFields: DynamicFormProps["fields"] = [
        {
            type: "email",
            modelName: "email",
            label: "Email Address",
            placeholder: "Email Address",
            labelClass,
            inputClass,
            validators: [
                { type: "required", message: "Email is required" },
                { type: "pattern", value: /^[^\s@]+@[^\s@]+.[^\s@]+$/, message: "Invalid email" },
            ],
        },
        {
            type: "password",
            modelName: "password",
            placeholder: "***********",
            label: "Password",
            labelClass,
            inputClass,
            validators: [
                { type: "required", message: "Password is required" },
                { type: "minLength", value: 6, message: "Minimum 6 characters" },
            ],
        },
    ];

    const signupFields: DynamicFormProps["fields"] = [
        {
            type: "text",
            modelName: "name",
            placeholder: "Full Name",
            label: "Full Name",
            labelClass,
            inputClass,
            validators: [{ type: "required", message: "Name is required" }],
        },
        ...loginFields,
    ];

    const handleSubmit = async (data: any) => {
        setLoading(true);
        try {
            await delay();
            if (mode === "login") {
                const user = await login(data.email, data.password);
                if (user) {
                    toast({ title: "Success", description: "Login successfully" });
                    router.push("/Pages/Dashboard");
                }
            } else {
                const user = await signup(data);
                if (user) {
                    setMode("login");
                    toast({ title: "Success", description: "Account created successfully" });
                } else {
                    toast({ variant: "destructive", title: "Error", description: "Failed to create Account" });
                }
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: e.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-white">
            {loading && <LoadingSpinner />}
            <div className="relative w-full max-w-md">
                <div className="relative z-10 flex flex-col items-center w-full p-5 mt-3 rounded-3xl bg-slate-100 border border-slate-300 shadow-2xl text-black transition-all duration-500">
                    <h1 className="text-4xl mt-2 font-bold">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="mt-2 text-sm font-light">
                        {mode === "login" ? "Enter your credentials to access your dashboard" : "Join us to start managing your tasks"}
                    </p>

                    <div className="w-full transition-opacity duration-300">

                        <DynamicForm
                            fields={mode === "login" ? loginFields : signupFields}
                            onSubmit={handleSubmit}
                            className="w-full mt-2"
                            buttonTitle={mode === "login" ? "Sign In" : "Get Started"}
                            buttonClassName="mt-10 w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white py-3 font-bold shadow-lg transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>

                    <div className=" text-sm text-gray-400">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                            className="ml-2 text-blue-700 font-semibold hover:text-blue-400 transition-colors"
                        >
                            {mode === "login" ? "Sign Up" : "Login"}
                        </button>
                    </div>
                </div>
                <Toaster />
            </div>
        </div>
    );
};

export default Login;