// ======================================
// Base Types
// ======================================
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

// ======================================
// Notification & Relations
// ======================================
export interface NotificationTrack {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  approvalRequestId: string;
  type: string;
  status: string;
  messageId: string;
  recipient: string;
  subject: string | null;
  content: string;
  metadata: Record<string, any>; // lebih aman dibanding `any`
  sentAt: string;
  deliveredAt: string | null;
  errorMessage: string | null;
  retryCount: number;
}

export interface ApprovalRequestWithRelations {
  approvalRequest: ApprovalRequest;
  notificationTracks: NotificationTrack[];
  approvalProcess: unknown; // gunakan `unknown` dulu, lebih aman dari pada `any`
}

// ======================================
// API Response Wrapper
// ======================================
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Response spesifik utk approval list
export type ApprovalRequestListResponse = ApiResponse<{
  data: ApprovalRequestWithRelations[];
  pagination: Pagination;
}>;
