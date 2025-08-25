// ======================================
// Base Types
// ======================================
export interface ApprovalProcess {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    approvalRequestId?: string;
    approvalRequest?: ApprovalRequest;
    approverId?: string;
    status?: string;
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


export interface ApprovalProcessResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  approvalRequestId: string;
  approvalRequest: {
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
    creator: null | {
      id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      username: string;
      email: string | null;
      phone: string | null;
      pin: string | null;
      password: string;
      isActive: boolean;
      role: {
        id: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        name: string;
        description: string;
        isActive: boolean;
      };
      roleId: string;
    };
    frontendUrl: string;
  };
  approverId: string;
  status: string;
  reasonRejected: string | null;
}
