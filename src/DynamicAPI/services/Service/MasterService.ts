// services/MasterServices/index.ts
import { createCrudService } from "../CreateCrudService";
import { Uom, CreateUom, UpdateUom } from "../../types/UomTypes";
import { Pallet, CreatePallet, UpdatePallet } from "../../types/PalletTypes";
import { Io, CreateIo, UpdateIo } from "../../types/IoTypes";
import { Warehouse, CreateWarehouse, UpdateWarehouse } from "../../types/WarehouseTypes";
import { Menu, CreateMenu, UpdateMenu } from "../../types/MenuTypes";
import { Item, CreateItem, UpdateItem } from "../../types/ItemTypes";


// Daftar semua entitas service di sini
export const uomService = createCrudService<Uom, CreateUom, UpdateUom>("/master-uom");
export const palletService = createCrudService<Pallet, CreatePallet, UpdatePallet>("/master-pallet");
export const IoService = createCrudService<Io, CreateIo, UpdateIo>("/master-io");
export const warehouseService = createCrudService<Warehouse, CreateWarehouse, UpdateWarehouse>("/master-warehouse");
export const MenuService = createCrudService<Menu, CreateMenu, UpdateMenu>("/menu");
export const ParentMenuService = createCrudService<Menu, CreateMenu, UpdateMenu>("/menu/parent");
export const ItemService = createCrudService<Item, CreateItem, UpdateItem>("/master-item");


