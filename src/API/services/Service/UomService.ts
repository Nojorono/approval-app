import { createCrudService } from "../CreateCrudService";
import { Uom, CreateUom, UpdateUom } from "../../types/UomTypes";

export const uomService = createCrudService<Uom, CreateUom, UpdateUom>("/master-uom");
