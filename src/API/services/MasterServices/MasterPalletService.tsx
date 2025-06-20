// src/API/services/MasterServices/RoleService.ts
import axiosInstance from "../AxiosInstance";

export interface Pallet {
    id: number;
    organization_id: number;
    pallet_code: string;
    uom_name: string;
    capacity: number;
    isActive: string;
    isEmpty: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PalletPayload {
    organization_id: number;
    pallet_code: string;
    uom_name: string;
    capacity: number;
    isActive: boolean;
    isEmpty: boolean;
}

/* ---------- helpers ---------- */
const assert200 = (statusCode: number, message = "Request failed") => {
    if (statusCode !== 200) throw new Error(message);
};

/* ---------- queries ---------- */
export const fetchAllPallet = async (): Promise<Pallet[]> => {
    const {data} = await axiosInstance.get("/master-pallet");

    assert200(data.success === true ? 200 : 500, data.message);

    return data.data.map((r: any) => ({
        id: r.id,
        organization_id: r.organization_id,
        pallet_code: r.pallet_code,
        uom_name: r.uom_name,
        capacity: r.capacity,
        isActive: r.isActive,
        isEmpty: r.isEmpty,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
    }));
};

export const getPalletById = async (id: number): Promise<Pallet> => {
    const {data} = await axiosInstance.get(`/master-pallet/${id}`);
    assert200(data.success === true ? 200 : 500, data.message);

    return {
        id: data.id,
        organization_id: data.organization_id,
        pallet_code: data.pallet_code,
        uom_name: data.uom_name,
        capacity: data.capacity,
        isActive: data.isActive,
        isEmpty:data.isEmpty,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

/* ---------- commands ---------- */
export const createPallet = async (payload: PalletPayload) => {
    const {data} = await axiosInstance.post("/master-pallet", payload);
    assert200(data.success === true ? 200 : 500, data.message);
    return data; // ⇦ biarkan store/UI yang mem-toast
};

export const updatePallet = async (id: number, payload: PalletPayload) => {
    const {data} = await axiosInstance.put(`/master-pallet/${id}`, payload);
    assert200(data.success === true ? 200 : 500, data.message);
    return data;
};

export const deletePallet = async (id: number) => {
    const {data} = await axiosInstance.delete(`/master-pallet/${id}`);
    assert200(data.success === true ? 200 : 500, data.message);
    return data;
};
