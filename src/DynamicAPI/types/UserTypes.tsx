export interface User {
  username: any;
  organizationId: number;
  password: string;
  firstName: string;
  lastName: string;
  isActive: string;
  roleId: number;
  role?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Partial<CreateUser>;
