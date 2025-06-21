import { createCrudStore } from "../../store/createCrudStore";
import { uomService } from "../../services/Service/UomService";
import { Uom, CreateUom, UpdateUom } from "../../types/UomTypes";

export const useStoreUom = createCrudStore<Uom, CreateUom, UpdateUom>({
    name: "UOM",
    service: uomService,
});
