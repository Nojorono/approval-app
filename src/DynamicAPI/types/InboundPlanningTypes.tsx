// =============================
// SHARED TYPES
// =============================

export interface InboundPlanningBase {
  inbound_planning_no: string;
  organization_id: number;
  source_id: number;
  delivery_no: string;
  po_no: string;
  client_name: string;
  order_type: string;
  task_type: string;
  notes: string;
  supplier_id: string;
  warehouse_id: string;
  plan_delivery_date: string;
  plan_status: string;
  plan_type: string;
}

// =============================
// POST Payload (Create)
// =============================

export interface InboundPlanningItemCreate {
  inbound_plan_id: string;
  sku: string;
  expired_date?: string;
  qty_plan: number;
  uom: string;
  classification_item_id: string;
}

export interface CreateInboundPlanning extends InboundPlanningBase {
  items: InboundPlanningItemCreate[];
}

// =============================
// GET ALL / GET BY ID (Read)
// =============================

export interface ItemDetail {
  id?: any;
  sku: string;
  name: string;
  description: string;
  organization_id: number;
  createdAt: string;
  updatedAt: string;
}

// =============================
// CLASSIFICATION TYPES
// =============================

export interface ClassificationItem {
  id: string;
  classification_name: string;
  classification_code: string;
  classification_description: string;
  createdAt: string;
  updatedAt: string;
}

export interface InboundPlanningItemRead {
  id?: any;
  item: ItemDetail | null;
  expired_date?: string;
  qty_plan: string;
  uom: string;
  classification_item: ClassificationItem | null;
  createdAt: string;
  updatedAt: string;
}

export interface InboundPlanning extends InboundPlanningBase {
  id?: any;
  items: InboundPlanningItemRead[];
  createdAt: string;
  updatedAt: string;
}

// =============================
// UPDATE Payload (Partial Create)
// =============================

export type UpdateInboundPlanning = Partial<CreateInboundPlanning>;
