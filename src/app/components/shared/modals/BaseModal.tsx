// components/modals/BaseModal.tsx
import React from "react";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    containerClassName?: string; // Allows passing custom width/padding
}

export default function BaseModal({ isOpen, onClose, children, containerClassName = "max-w-sm" }: BaseModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-xl shadow-xl w-full p-6 space-y-4 text-slate-800 ${containerClassName}`}>
                {children}
            </div>
        </div>
    );
}