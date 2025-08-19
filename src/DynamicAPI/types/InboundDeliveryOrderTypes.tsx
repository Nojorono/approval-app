export interface InboundDeliveryOrder {
  inbound_plan_id: string;
  inbound_transporter_id: string;
  number_delivery_order: string;
  items: {
    inbound_delivery_order_id: string;
    item_id: string;
    qty_plan: number;
    uom: string;
  }[];
  created_by?: string;
  updated_by?: string;
}

export type CreateInboundDeliveryOrder = Omit<InboundDeliveryOrder, "id">;
export type UpdateInboundDeliveryOrder = Partial<CreateInboundDeliveryOrder>;
