export interface SubWarehouse {
  id: string;
  organization_id: number;
  warehouse_id: string;
  name: string;
  code: string;
  description: string;
  capacity_bin: number;
}

export type CreateSubWarehouse = Omit<SubWarehouse, "id">;
export type UpdateSubWarehouse = Partial<CreateSubWarehouse>;
