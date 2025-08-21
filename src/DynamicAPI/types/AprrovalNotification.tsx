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
  createdBy: string;
  frontendUrl: string;
}

export interface ApprovalNotification {
  note: any;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  approvalRequestId: string;
  approvalRequest: ApprovalRequest;
  type: string;
  status: string;
  messageId: string;
  recipient: string;
  recipientId: string;
  subject: string | null;
  content: string;
  metadata: any | null;
  sentAt: string;
  deliveredAt: string | null;
  errorMessage: string | null;
  retryCount: number;
}

export type CreateApprovalNotification = Omit<ApprovalNotification, "id">;
export type UpdateApprovalNotification = Partial<CreateApprovalNotification>;
