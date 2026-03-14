import { useState } from "react";
import BaseModal from "./BaseModal";

export default function RejectModal({ isOpen, onClose, onConfirm }: any) {
    const [reason, setReason] = useState("");

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <h3 className="font-bold text-lg">Reject Submission</h3>
            <p className="text-sm text-slate-600">Provide a reason for rejection:</p>
            <textarea
                autoFocus
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                    onClick={() => onConfirm(reason)}
                    disabled={!reason.trim()}
                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg disabled:opacity-50"
                >Confirm</button>
            </div>
        </BaseModal>
    );
}