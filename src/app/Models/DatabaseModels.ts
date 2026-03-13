export type Role = "admin" | "worker";

export interface User {
    id: string;
    name: string;
    email: string;
    password : string;
    role: Role;
    createdAt: string;
}

export type TaskType =
    | "SOCIAL_MEDIA_POST"
    | "EMAIL_SEND"
    | "SOCIAL_MEDIA_LIKE";

export interface Task {
    id: string;
    taskType: TaskType;
    title: string;
    description?: string;
    details: string;
    amount: number;
    reward: number;
    allowMultipleSubmissions?: boolean;
    campaignId?: string;
    createdAt: string;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
    id: string;
    taskId: string;
    workerId: string;
    fields: {
        postUrl?: string;
        emailContent?: string;
        screenshot?: string;
    };
    status: SubmissionStatus;
    rejectionReason?: string;
    createdAt: string;
}

export interface Campaign {
    id: string;
    name: string;
}