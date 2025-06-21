export interface Uom {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateUom = Omit<Uom, "id" | "createdAt" | "updatedAt">;
export type UpdateUom = Partial<CreateUom>;
