export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  isActive: boolean;
}

export interface User {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  username: string;
  email?: string | null;
  phone?: string | null;
  pin?: string | null;
  password: string;
  isActive: boolean;
  role?: Role;
  roleId: string;
}

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt" | "role">;
export type UpdateUser = Partial<CreateUser>;
