import { create } from "zustand";
import { showErrorToast } from "../../../components/toast";
import {
    createPallet, deletePallet,
    fetchAllPallet, getPalletById,
    Pallet,
    PalletPayload, updatePallet
} from "../../services/MasterServices/MasterPalletService.tsx";
import {getRoleById} from "../../services/MasterServices";


type Result = { ok: true } | { ok: false; message: string };

interface PalletState {
    dataPallet: Pallet[];
    loading: boolean;
    error: string | null;

    fetchPallet: () => Promise<void>;
    fetchPalletById: (id: number) => Promise<Pallet>;

    createPallet: (data: PalletPayload) => Promise<Result>;
    updatePallet: (id: number, data: PalletPayload) => Promise<Result>;
    deletePallet: (id: number) => Promise<Result>;

    reset: () => void;
}

export const usePalletStore = create<PalletState>((set) => ({
    dataPallet: [],
    loading: false,
    error: null,

    /* ---------- queries ---------- */
    fetchPallet: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchAllPallet();

            localStorage.setItem("local_pallet", JSON.stringify(data));
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
            set({ error: e.message, loading: false });
            throw e;
        }
    },

    /* ---------- commands ---------- */
    createPallet: async (data) => {
        set({ loading: true, error: null });
        try {
            const newPallet = await createPallet(data);
            set((s) => ({ dataPallet: [...s.dataPallet, newPallet], loading: false }));
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
            const updated = await updatePallet(id, data);
            set((s) => ({
                dataPallet: s.dataPallet.map((m) => (m.id === id ? { ...m, ...updated } : m)),
                loading: false,
            }));
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
