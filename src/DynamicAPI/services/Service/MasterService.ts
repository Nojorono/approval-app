// services/MasterServices/index.ts
import { createCrudService } from "../CreateCrudService";
import { Menu, CreateMenu, UpdateMenu } from "../../types/MenuTypes";
import { User, CreateUser, UpdateUser } from "../../types/UserTypes";
import { RoleRead, CreateRolePayload, UpdateRolePayload } from '../../types/MasterRoleTypes';
import { ApprovalRequest, CreateApprovalRequest, UpdateApprovalRequest, ApprovalRequestListResponse } from '../../types/ApprovalRequestTypes'
import { ApprovalProcess, CreateApprovalProcess, UpdateApprovalProcess } from "../../types/ApprovalProcessTypes";
import { ApprovalNotification, CreateApprovalNotification, UpdateApprovalNotification } from '../../types/AprrovalNotification'


// Daftar semua entitas service di sini
export const MenuService = createCrudService<Menu, CreateMenu, UpdateMenu>("/menu");
export const ParentMenuService = createCrudService<Menu, CreateMenu, UpdateMenu>("/menu/parent");
export const UserService = createCrudService<User, CreateUser, UpdateUser>("/user");
export const roleService = createCrudService<RoleRead, CreateRolePayload, UpdateRolePayload>("/roles");
export const approvalRequestService = createCrudService<ApprovalRequest, CreateApprovalRequest, UpdateApprovalRequest>("/approval-requests");
export const approvalRequestWithRelationsService = createCrudService<ApprovalRequestListResponse, CreateApprovalRequest, UpdateApprovalRequest>("/approval-requests/with-relations");
export const approvalProcessService = createCrudService<ApprovalProcess, CreateApprovalProcess, UpdateApprovalProcess>("/approval-process");
export const approvalNotificationService = createCrudService<ApprovalNotification, CreateApprovalNotification, UpdateApprovalNotification>("/approval-requests/notifications/check-status");