import { createCrudStore } from "../CreateCrudStore";
import {
    MenuService,
    ParentMenuService,
    UserService,
    roleService,
    approvalRequestService,
    approvalRequestWithRelationsService,
    approvalProcessService,
    approvalNotificationService
} from "../../services/Service/MasterService";
import { Menu, CreateMenu, UpdateMenu } from "../../types/MenuTypes";
import { CreateUser, User, UpdateUser } from "../../types/UserTypes.tsx";
import { RoleRead, CreateRolePayload, UpdateRolePayload } from '../../types/MasterRoleTypes';
import { ApprovalRequest, CreateApprovalRequest, UpdateApprovalRequest, ApprovalRequestListResponse } from '../../types/ApprovalRequestTypes';
import { ApprovalProcess, CreateApprovalProcess, UpdateApprovalProcess } from "../../types/ApprovalProcessTypes.tsx";
import { ApprovalNotification, CreateApprovalNotification, UpdateApprovalNotification } from '../../types/AprrovalNotification.tsx';

export const useStoreMenu = createCrudStore<Menu, CreateMenu, UpdateMenu>({
    name: "Menu",
    service: MenuService,
});

export const useStoreParentMenu = createCrudStore<Menu, CreateMenu, UpdateMenu>({
    name: "Parent Menu",
    service: ParentMenuService,
});


export const useStoreUser = createCrudStore<User, CreateUser, UpdateUser>({
    name: "User",
    service: UserService,
});

export const useStoreRole = createCrudStore<RoleRead, CreateRolePayload, UpdateRolePayload>({
    name: "Role",
    service: roleService,
});

export const useStoreApprovalRequest = createCrudStore<ApprovalRequest, CreateApprovalRequest, UpdateApprovalRequest>({
    name: "ApprovalRequest",
    service: approvalRequestService,
});

export const useStoreApprovalRequestWithRelations = createCrudStore<ApprovalRequestListResponse, CreateApprovalRequest, UpdateApprovalRequest>({
    name: "ApprovalRequestWithRelations",
    service: approvalRequestWithRelationsService,
});

export const useStoreApprovalProcess = createCrudStore<ApprovalProcess, CreateApprovalProcess, UpdateApprovalProcess>({
    name: "ApprovalProcess",
    service: approvalProcessService,
});

export const useStoreApprovalNotification = createCrudStore<ApprovalNotification, CreateApprovalNotification, UpdateApprovalNotification>({
    name: "ApprovalNotification",
    service: approvalNotificationService,
});