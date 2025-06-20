import { create } from "zustand";
import {
    fetchIO,
    fetchIOById,
    createIO,
    updateIO,
    deleteIO,
    IO,
    CreateIOPayload,
    UpdateIOPayload
} from "../../services/MasterServices";
import { showErrorToast, showSuccessToast } from "../../../components/toast";

interface IOState {
    io: IO | null;
    ioList: IO[];
    isLoading: boolean;
    error: string | null;

    fetchIOData: () => Promise<void>;
    fetchIOById: (id: string) => Promise<void>;
    createIOData: (payload: CreateIOPayload) => Promise<{ success: boolean; message?: string }>;
    updateIOData: (id: string, payload: UpdateIOPayload) => Promise<void>;
    deleteIOData: (id: string) => Promise<void>;
}

export const useIOStore = create<IOState>((set) => ({
    io: null,
    ioList: [],
    isLoading: false,
    error: null,

    fetchIOData: async () => {
        set({ isLoading: true, error: null });
        try {
            const ioList = await fetchIO();            
            // Ensure the result is of type IO[]
            set({ ioList: ioList as unknown as IO[] });
        } catch (error: any) {
            const message = error.message || "Failed to fetch IO";
            showErrorToast(message);
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchIOById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const io = await fetchIOById(id);
            set({ io });
        } catch (error: any) {
            const message = error.message || "Failed to fetch IO by ID";
            showErrorToast(message);
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    createIOData: async (payload: CreateIOPayload): Promise<{ success: boolean; message?: string }> => {
        set({ isLoading: true, error: null });
        try {
            const io = await createIO(payload);
            set((state) => ({
                io,
                ioList: [...state.ioList, io]
            }));
            showSuccessToast("IO created successfully");
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

    updateIOData: async (id: string, payload: UpdateIOPayload) => {
        set({ isLoading: true, error: null });
        try {
            const updatedIO = await updateIO(id, payload);
            set((state) => ({
                io: updatedIO,
                ioList: state.ioList.map((item) => (String(item.id) === id ? updatedIO : item))
            }));
            showSuccessToast("IO updated successfully");
        } catch (error: any) {
            const message = error.message || "Failed to update IO";
            showErrorToast(message);
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteIOData: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await deleteIO(id);
            set((state) => ({
                io: String(state.io?.id) === id ? null : state.io,
                ioList: state.ioList.filter((item) => String(item.id) !== id)
            }));
            showSuccessToast("IO deleted successfully");
        } catch (error: any) {
            const message = error.message || "Failed to delete IO";
            showErrorToast(message);
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    }
}));
