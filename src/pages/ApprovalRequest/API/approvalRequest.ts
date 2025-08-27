import axios from "axios";
import { EnPoint } from "../../../utils/EndPoint";


// Typings sesuai dengan struktur data
export interface Role {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface Approver {
    id: string;
    username: string;
    role: Role;
}

export interface ApprovalRequest {
    id: string;
    code: string;
    subject: string;
    description: string;
    status: string;
    createdBy: string;
    frontendUrl: string;
    attachments: string[];
    approverIds: Approver[];
    createdAt: string;
    updatedAt: string;
}

export interface NotificationTrack {
    id: string;
    type: "email" | "whatsapp";
    status: string;
    recipient: string;
    recipientId: string;
    subject: string | null;
    content: string;
    sentAt: string;
}

export interface ApprovalProcess {
    id: string;
    approvalRequestId: string;
    approverId: string;
    status: string;
    reasonRejected: string | null;
}

export interface ApprovalRecord {
    approvalRequest: ApprovalRequest;
    notificationTracks: NotificationTrack[];
    approvalProcess: ApprovalProcess;
}

export interface ApprovalResponse {
    success: boolean;
    message: string;
    data: {
        data: ApprovalRecord[];
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

// ✅ Fungsi API untuk ambil data approval request
export const fetchApprovalRequests = async (
    page: number = 1,
    limit?: number,
    createdBy?: string
): Promise<ApprovalResponse> => {
    try {
        const token = localStorage.getItem("token");
        // Build query params dynamically
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (limit !== undefined) params.append("limit", limit.toString());
        if (createdBy) params.append("createdBy", createdBy);

        const res = await axios.get<ApprovalResponse>(
            `${EnPoint}approval-requests/with-relations?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to fetch approval requests");
    }
};
