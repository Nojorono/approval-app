// ======================================
// Base Types
// ======================================
export interface ApprovalProcess {
    approvalRequestId: string;
    approverId: string;
    status: string;
    reasonRejected?: string;
}

export type CreateApprovalProcess = Omit<ApprovalProcess, "approvalRequestId">;
export type UpdateApprovalProcess = Partial<ApprovalProcess>;
