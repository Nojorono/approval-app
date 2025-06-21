export interface Pallet {
  organization_id: number;
  pallet_code: string;
  uom_name: string;
  capacity: number;
  isActive: boolean;
  isEmpty: boolean;
}

export type CreatePallet = Omit<Pallet, "id">;
export type UpdatePallet = Partial<CreatePallet>;
