export interface InboundPlanningItem {
  inbound_plan_id: string;
  item_id: string;
  expired_date: string;
  qty_plan: number;
  uom: string;
  classification_item_id: string;
}

export interface InboundPlanning {
  id?: any;
  inbound_planning_no: string;
  organization_id: number;
  delivery_no: string;
  po_no: string;
  client_name: string;
  order_type: string;
  task_type: string;
  notes: string;
  supplier_id: string;
  warehouse_id: string;
  items: InboundPlanningItem[];
  plan_delivery_date: string;
  plan_status: string;
  plan_type: string;
}

export type CreateInboundPlanning = Omit<InboundPlanning, "id">;
export type UpdateInboundPlanning = Partial<CreateInboundPlanning>;
