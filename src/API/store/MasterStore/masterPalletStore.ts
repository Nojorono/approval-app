import { create } from "zustand";
import { showErrorToast } from "../../../components/toast";
import {
    fetchAllPallet,
    getPalletById,
    createPallet,
    updatePallet,
    deletePallet,
    Pallet,
    PalletPayload,
} from "../../services/MasterServices/MasterPalletService";

type Result = { ok: true } | { ok: false; message: string };

interface PalletState {
    dataPallet: Pallet[];
    loading: boolean;
    error: string | null;

    fetchPallet: () => Promise<void>;
    fetchPalletById: (id: number) => Promise<Pallet | null>;

    createPallet: (data: PalletPayload) => Promise<Result>;
    updatePallet: (id: number, data: PalletPayload) => Promise<Result>;
    deletePallet: (id: number) => Promise<Result>;

    reset: () => void;
}

export const usePalletStore = create<PalletState>((set, get) => ({
    dataPallet: [],
    loading: false,
    error: null,

    fetchPallet: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchAllPallet();
            set({ dataPallet: data, loading: false });
        } catch (e: any) {
            showErrorToast(e.message);
            set({ error: e.message, loading: false });
        }
    },

    fetchPalletById: async (id) => {
        set({ loading: true, error: null });
        try {
            const pallet = await getPalletById(id);
            set({ loading: false });
            return pallet;
        } catch (e: any) {
            showErrorToast(e.message);
            set({ error: e.message, loading: false });
            return null;
        }
    },

    createPallet: async (data) => {
        set({ loading: true, error: null });
        try {
            // Pastikan payload sesuai format dan tipe data yang dibutuhkan server
            const finalPayload = {
                organization_id: Number(data.organization_id),
                pallet_code: String(data.pallet_code),
                uom_name: String(data.uom_name),
                capacity: Number(data.capacity),
                isActive: Boolean(data.isActive),
                isEmpty: Boolean(data.isEmpty),
            };
            const res = await createPallet(finalPayload);
            // Ambil data baru dari response, atau fetch ulang
            await get().fetchPallet();
            set({ loading: false });
            return { ok: true };
        } catch (e: any) {
            showErrorToast(e.message);
            set({ error: e.message, loading: false });
            return { ok: false, message: e.message };
        }
    },

    updatePallet: async (id, data) => {
        set({ loading: true, error: null });
        try {
            // Pastikan payload sesuai format dan tipe data yang dibutuhkan server
            const finalPayload = {
                organization_id: Number(data.organization_id),
                pallet_code: String(data.pallet_code),
                uom_name: String(data.uom_name),
                capacity: Number(data.capacity),
                isActive: Boolean(data.isActive),
                isEmpty: Boolean(data.isEmpty),
            };
            await updatePallet(id, finalPayload);
            await get().fetchPallet();
            set({ loading: false });
            return { ok: true };
        } catch (e: any) {
            showErrorToast(e.message);
            set({ error: e.message, loading: false });
            return { ok: false, message: e.message };
        }
    },

    deletePallet: async (id) => {
        set({ loading: true, error: null });
        try {
            await deletePallet(id);
            set((s) => ({
                dataPallet: s.dataPallet.filter((m) => m.id !== id),
                loading: false,
            }));
            return { ok: true };
        } catch (e: any) {
            showErrorToast(e.message);
            set({ error: e.message, loading: false });
            return { ok: false, message: e.message };
        }
    },

    reset: () => set({ dataPallet: [], loading: false, error: null }),
}));
