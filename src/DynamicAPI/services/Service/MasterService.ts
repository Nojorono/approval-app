// services/MasterServices/index.ts
import { createCrudService } from "../CreateCrudService";
import { Uom, CreateUom, UpdateUom } from "../../types/UomTypes";
import { Pallet, CreatePallet, UpdatePallet } from "../../types/PalletTypes";

// Daftar semua entitas service di sini
export const uomService = createCrudService<Uom, CreateUom, UpdateUom>("/master-uom");
export const palletService = createCrudService<Pallet, CreatePallet, UpdatePallet>("/master-pallet");
