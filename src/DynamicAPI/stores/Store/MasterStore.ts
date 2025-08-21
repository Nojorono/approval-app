import { createCrudStore } from "../CreateCrudStore";
import {
    uomService,
    palletService,
    IoService,
    warehouseService,
    MenuService,
    ParentMenuService,
    ItemService,
    supplierService,
    InboundPlanningService,
    UserService,
    CheckerAssignService,
    ClassificationService,
    VehicleService,
    TransporterService,
    subWarehouseService,
    binService,
    sourceService,
    inboundDeliveryOrderService,
    inboundAttachmentService,
    checkerScanService,
    roleService,
    approvalRequestService,
    approvalRequestWithRelationsService,
    approvalProcessService,
    approvalNotificationService
} from "../../services/Service/MasterService";

import { Uom, CreateUom, UpdateUom } from "../../types/UomTypes";
import { Pallet, CreatePallet, UpdatePallet } from "../../types/PalletTypes";
import { Io, CreateIo, UpdateIo } from "../../types/IoTypes";
import { Warehouse, CreateWarehouse, UpdateWarehouse } from "../../types/WarehouseTypes";
import { Menu, CreateMenu, UpdateMenu } from "../../types/MenuTypes";
import { Item, CreateItem, UpdateItem } from "../../types/ItemTypes";
import { CreateSupplier, Supplier, UpdateSupplier } from "../../types/SupplierTypes.tsx";
import { InboundPlanning, CreateInboundPlanning, UpdateInboundPlanning } from "../../types/InboundPlanningTypes.tsx";
import { CreateUser, User, UpdateUser } from "../../types/UserTypes.tsx";
import { CreateCheckerAssign, CheckerAssign, UpdateCheckerAssign } from "../../types/CheckerAssignTypes.tsx";
import { CreateClassification, Classification, UpdateClassification } from "../../types/ClassificationTypes.tsx";
import { CreateVehicle, Vehicle, UpdateVehicle } from "../../types/VehicleTypes.tsx";
import { CreateTransporter, Transporter, UpdateTransporter } from "../../types/TransporterTypes.tsx";
import { SubWarehouse, CreateSubWarehouse, UpdateSubWarehouse } from "../../types/SubWarehouseTypes";
import { Bin, CreateBin, UpdateBin } from "../../types/MasterBinTypes";
import { Source, CreateSource, UpdateSource } from "../../types/MasterSourceTypes";
import { InboundDeliveryOrder, CreateInboundDeliveryOrder, UpdateInboundDeliveryOrder } from "../../types/InboundDeliveryOrderTypes";
import { InboundAttachment, CreateInboundAttachment, UpdateInboundAttachment } from "../../types/InboundAttachmentTypes";
import { CheckerScan, CreateCheckerScan, UpdateCheckerScan } from '../../types/CheckerScanTypes'
import { RoleRead, CreateRolePayload, UpdateRolePayload } from '../../types/MasterRoleTypes';

import { ApprovalRequest, CreateApprovalRequest, UpdateApprovalRequest, ApprovalRequestListResponse } from '../../types/ApprovalRequestTypes';
import { ApprovalProcess, CreateApprovalProcess, UpdateApprovalProcess } from "../../types/ApprovalProcessTypes.tsx";
import { ApprovalNotification, CreateApprovalNotification, UpdateApprovalNotification } from '../../types/AprrovalNotification.tsx';


export const useStoreUom = createCrudStore<Uom, CreateUom, UpdateUom>({
    name: "UOM",
    service: uomService,
});

export const useStorePallet = createCrudStore<Pallet, CreatePallet, UpdatePallet>({
    name: "Pallet",
    service: palletService,
});

export const useStoreIo = createCrudStore<Io, CreateIo, UpdateIo>({
    name: "Io",
    service: IoService,
});

export const useStoreWarehouse = createCrudStore<Warehouse, CreateWarehouse, UpdateWarehouse>({
    name: "Warehouse",
    service: warehouseService,
});

export const useStoreMenu = createCrudStore<Menu, CreateMenu, UpdateMenu>({
    name: "Menu",
    service: MenuService,
});

export const useStoreParentMenu = createCrudStore<Menu, CreateMenu, UpdateMenu>({
    name: "Parent Menu",
    service: ParentMenuService,
});

export const useStoreItem = createCrudStore<Item, CreateItem, UpdateItem>({
    name: "Item",
    service: ItemService,
});

export const useStoreSupplier = createCrudStore<Supplier, CreateSupplier, UpdateSupplier>({
    name: "Supplier",
    service: supplierService,
});

export const useStoreInboundPlanning = createCrudStore<InboundPlanning, CreateInboundPlanning, UpdateInboundPlanning>({
    name: "InboundPlanning",
    service: InboundPlanningService,
});

export const useStoreUser = createCrudStore<User, CreateUser, UpdateUser>({
    name: "User",
    service: UserService,
});

export const useStoreCheckerAssign = createCrudStore<CheckerAssign, CreateCheckerAssign, UpdateCheckerAssign>({
    name: "CheckerAssign",
    service: CheckerAssignService,
});

export const useStoreClassification = createCrudStore<Classification, CreateClassification, UpdateClassification>({
    name: "Classification",
    service: ClassificationService,
});

export const useStoreVehicle = createCrudStore<Vehicle, CreateVehicle, UpdateVehicle>({
    name: "Vehicle",
    service: VehicleService,
});

export const useStoreTransporter = createCrudStore<Transporter, CreateTransporter, UpdateTransporter>({
    name: "Transporter",
    service: TransporterService,
});

export const useStoreSubWarehouse = createCrudStore<SubWarehouse, CreateSubWarehouse, UpdateSubWarehouse>({
    name: "SubWarehouse",
    service: subWarehouseService,
});

export const useStoreBin = createCrudStore<Bin, CreateBin, UpdateBin>({
    name: "Bin",
    service: binService,
});

export const useStoreSource = createCrudStore<Source, CreateSource, UpdateSource>({
    name: "Source",
    service: sourceService,
});

export const useStoreInboundDeliveryOrder = createCrudStore<InboundDeliveryOrder, CreateInboundDeliveryOrder, UpdateInboundDeliveryOrder>({
    name: "InboundDeliveryOrder",
    service: inboundDeliveryOrderService,
});

export const useStoreInboundAttachment = createCrudStore<InboundAttachment, CreateInboundAttachment, UpdateInboundAttachment>({
    name: "InboundAttachment",
    service: inboundAttachmentService,
});

export const useStoreCheckerScan = createCrudStore<CheckerScan, CreateCheckerScan, UpdateCheckerScan>({
    name: "CheckerScan",
    service: checkerScanService,
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