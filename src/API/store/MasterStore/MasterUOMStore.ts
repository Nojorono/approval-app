import { create } from "zustand";
import {
  fetchUOM,
  fetchUomById,
  createUom,
  updateUom,
  deleteUom,
  Uom,
  CreateUomPayload,
  UpdateUomPayload,
} from "../../services/MasterServices/MasterUOMService";
import { showErrorToast, showSuccessToast } from "../../../components/toast";

interface UomState {
  uom: Uom[]; // list
  detailUOM: Uom | null;
  isLoading: boolean;
  error: string | null;
  fetchUOM: () => Promise<{ success: boolean; message?: string }>;
  createUomData: (
    payload: CreateUomPayload
  ) => Promise<{ success: boolean; message?: string }>;
  updateUomData: (id: number, payload: UpdateUomPayload) => Promise<{ success: boolean; message?: string }>;
  deleteUomData: (id: number) => Promise<void>;
  fetchUomById: (id: number) => Promise<void>;
}

export const useUomStore = create<UomState>((set, get) => ({
  uom: [],
  detailUOM: null,
  isLoading: false,
  error: null,

  fetchUOM: async () => {
    set({ isLoading: true, error: null });
    try {
      const uom = await fetchUOM();
      set({ uom });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch UOM data";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUomById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const detailUOM = await fetchUomById(id);
      set({ detailUOM });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch UOM by id";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  createUomData: async (payload: CreateUomPayload): Promise<{ success: boolean; message?: string }> => {
    set({ isLoading: true, error: null });
    try {
      await createUom(payload);
      showSuccessToast("UOM created successfully");
      await get().fetchUOM();
      return { success: true };
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || "Failed to create IO";
      showErrorToast(message);
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ isLoading: false });
    }
  },

  updateUomData: async (id: number, payload: UpdateUomPayload): Promise<{ success: boolean; message?: string }> => {
    set({ isLoading: true, error: null });
    try {
      await updateUom(id, payload);
      showSuccessToast("UOM updated successfully");
      // Refresh list
      await get().fetchUOM();
      return { success: true };
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || "Failed to create IO";
      showErrorToast(message);
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUomData: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteUom(id);
      showSuccessToast("UOM deleted successfully");
      // Refresh list
      await get().fetchUOM();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete UOM";
      showErrorToast(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
}));
