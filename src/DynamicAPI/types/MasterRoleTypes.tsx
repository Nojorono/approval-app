// =============================
// POST Payload (Create)
// =============================

export interface RolePermissionCreate {
  menu_id: string;
  action: string;
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: RolePermissionCreate[];
}

// =============================
// GET ALL / GET BY ID (Read)
// =============================

export interface MenuAction {
  id: string;
  name: string;
  path: string;
  icon: string;
  parentId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  actions: string[];
}

export interface RoleRead {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  menus: MenuAction[];
  createdAt: string;
  updatedAt: string;
}

// =============================
// UPDATE Payload (Partial Create)
// =============================

export type UpdateRolePayload = Partial<CreateRolePayload>;
