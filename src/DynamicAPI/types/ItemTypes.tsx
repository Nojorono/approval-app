export interface Item {
  sku: string;
  name: string;
  description: string;
  organization_id: number;
}

export type CreateItem = Omit<Item, "id">;
export type UpdateItem = Partial<CreateItem>;
