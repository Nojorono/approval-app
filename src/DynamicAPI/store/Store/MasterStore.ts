import { createCrudStore } from "../createCrudStore";
import { uomService, palletService } from "../../services/Service/MasterService";
import { Uom, CreateUom, UpdateUom } from "../../types/UomTypes";
import { Pallet, CreatePallet, UpdatePallet } from "../../types/PalletTypes";

export const useStoreUom = createCrudStore<Uom, CreateUom, UpdateUom>({
    name: "UOM",
    service: uomService,
});

export const useStorePallet = createCrudStore<Pallet, CreatePallet, UpdatePallet>({
    name: "Pallet",
    service: palletService,
});
