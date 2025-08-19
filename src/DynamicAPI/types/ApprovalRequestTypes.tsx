export interface ApprovalRequest {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  code?: string;
  subject: string;
  approverIds: string[];
  description: string;
  attachments: string[];
  status: string;
  createdBy?: string | null;
}

export type CreateApprovalRequest = Omit<ApprovalRequest, "id">;
export type UpdateApprovalRequest = Partial<CreateApprovalRequest>;
