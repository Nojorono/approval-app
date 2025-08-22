// ======================================
// Base Types
// ======================================
export interface ApprovalProcess {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    approvalRequestId: string;
    approvalRequest: ApprovalRequest;
    approverId: string;
    status: string;
    reasonRejected?: string | null;
}

export interface ApprovalRequest {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    code: string;
    subject: string;
    approverIds: string[];
    description: string;
    attachments: string[];
    status: string;
    createdBy: string | null;
    creator: string | null;
    frontendUrl: string;
}

export type CreateApprovalProcess = Omit<ApprovalProcess, "approvalRequestId">;
export type UpdateApprovalProcess = Partial<ApprovalProcess>;
