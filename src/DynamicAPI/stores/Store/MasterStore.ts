import { createCrudStore } from "../CreateCrudStore";
import { uomService, palletService, IoService, warehouseService, MenuService, ParentMenuService, ItemService } from "../../services/Service/MasterService";

import { Uom, CreateUom, UpdateUom } from "../../types/UomTypes";
import { Pallet, CreatePallet, UpdatePallet } from "../../types/PalletTypes";
import { Io, CreateIo, UpdateIo } from "../../types/IoTypes";
import { Warehouse, CreateWarehouse, UpdateWarehouse } from "../../types/WarehouseTypes";
import { Menu, CreateMenu, UpdateMenu } from "../../types/MenuTypes";

import { Item, CreateItem, UpdateItem } from "../../types/ItemTypes";

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