import { create } from "zustand";
import {
  fetchUom,
  fetchUomById,
  createUom,
  updateUom,
  deleteUom,
  Uom,
  CreateUomPayload,
  UpdateUomPayload,
} from "../../services/MasterServices/MasterUOMService";
import { showErrorToast } from "../../../components/toast";

interface UomState {
  uom: Uom | null;
  detailUOM: Uom | null;
  isLoading: boolean;
  error: string | null;
  fetchUomData: () => Promise<void>;
  createUomData: (payload: CreateUomPayload) => Promise<void>;
  updateUomData: (id: number, payload: UpdateUomPayload) => Promise<void>;
  deleteUomData: (id: number) => Promise<void>;
  fetchUomById: (id: number) => Promise<void>;
}

export const useUomStore = create<UomState>((set) => ({
  uom: null,
  detailUOM: null,
  isLoading: false,
  error: null,

  fetchUomData: async () => {
    set({ isLoading: true, error: null });
    try {
      const uom = await fetchUom();
      if (uom) {
        set({ uom });
      } else {
        set({ error: "Failed to fetch UOM data" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch UOM data";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUomById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const detailUOM = await fetchUomById(id);
      if (detailUOM) {
        set({ detailUOM });
      } else {
        set({ error: "Failed to fetch UOM by id" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch UOM by id";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  createUomData: async (payload: CreateUomPayload) => {
    set({ isLoading: true, error: null });
    try {
      const uom = await createUom(payload);
      if (uom) {
        set({ uom });
      } else {
        set({ error: "Failed to create UOM" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create UOM";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUomData: async (id: number, payload: UpdateUomPayload) => {
    set({ isLoading: true, error: null });
    try {
      const uom = await updateUom(id, payload);
      if (uom) {
        set({ uom });
      } else {
        set({ error: "Failed to update UOM" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update UOM";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUomData: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const success = await deleteUom(id);
      if (success) {
        set({ uom: null });
      } else {
        set({ error: "Failed to delete UOM" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete UOM";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
}));
