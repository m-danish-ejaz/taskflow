"use client";
import { FC, useState } from "react";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import { DynamicFormProps } from "@/app/components/ui/DynamicForm/models/DynamicFormProps";
import LazyImage from "@/app/components/ui/lazyImage/lazyImage";
import greenBg from "../../../assets/images/greenBg.jpg";
import greenBgSmall from "../../../assets/images/greenBg-small.jpg";

const Login: FC = () => {
    const [mode, setMode] = useState<"login" | "signup">("login");

    const loginFields: DynamicFormProps["fields"] = [
        {
            type: "email",
            modelName: "email",
            label: "Email",
            className:
                "border-0 mt-6 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none bg-transparent",
            validators: [
                { type: "required", message: "Email is required" },
                {
                    type: "pattern",
                    value: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
                    message: "Invalid email",
                },
            ],
        },
        {
            type: "password",
            modelName: "password",
            label: "Password",
            className:
                "border-0 mt-6 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none bg-transparent",
            validators: [
                { type: "required", message: "Password is required" },
                {
                    type: "minLength",
                    value: 6,
                    message: "Minimum 6 characters",
                },
            ],
        },
    ];

    const signupFields: DynamicFormProps["fields"] = [
        {
            type: "text",
            modelName: "name",
            label: "Full Name",
            className:
                "border-0 mt-6 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none bg-transparent",
            validators: [{ type: "required", message: "Name is required" }],
        },
        ...loginFields,
    ];

    const handleFormSubmit = async (data: Record<string, any>) => {
        console.log(mode, data);
    };

    return (
        <div className="relative z-10 flex flex-col items-center w-full max-w-md p-10 rounded-3xl backdrop-blur-md bg-white/10 shadow-xl border border-white/20">
            <h1 className="text-3xl font-semibold text-white">
                {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>

            <p className="text-sm text-gray-200 mt-2">
                {mode === "login"
                    ? "Login to continue"
                    : "Sign up to start completing tasks"}
            </p>

            <DynamicForm
                fields={mode === "login" ? loginFields : signupFields}
                onSubmit={handleFormSubmit}
                className="w-full mt-6"
                buttonTitle={mode === "login" ? "Login" : "Sign Up"}
                buttonClassName="mt-8 w-full rounded-xl bg-green-500 hover:bg-green-600 text-white py-2 font-semibold"
            />

            <div className="mt-6 text-sm text-gray-200">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}

                <button
                    onClick={() =>
                        setMode(mode === "login" ? "signup" : "login")
                    }
                    className="ml-2 text-green-300 hover:underline"
                >
                    {mode === "login" ? "Sign Up" : "Login"}
                </button>
            </div>
        </div>
    );
};

export default Login;
