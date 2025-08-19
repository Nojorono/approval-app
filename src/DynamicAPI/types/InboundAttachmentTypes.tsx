export interface InboundAttachment {
    id: string;
    inbound_plan_id: string;
    organization_id: number;
    name: string;
    path: string | null;
    s3_bucket: string;
    s3_key: string;
    s3_url: string;
    file_size: number | null;
    content_type: string;
    etag: string;
    is_public: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateInboundAttachment = Omit<InboundAttachment, "id" | "createdAt" | "updatedAt">;
export type UpdateInboundAttachment = Partial<CreateInboundAttachment>;
