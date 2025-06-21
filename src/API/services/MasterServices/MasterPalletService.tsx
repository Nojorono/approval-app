import axiosInstance from "../AxiosInstance";

export interface Pallet {
  id: number;
  organization_id: number;
  pallet_code: string;
  uom_name: string;
  capacity: number;
  isActive: boolean;
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

const assertSuccess = (data: any) => {
  if (!data.success) {
    const errorMsg = data.error || data.message || "Request failed";
    throw new Error(errorMsg);
  }
};

/* ---------- queries ---------- */
export const fetchAllPallet = async (): Promise<Pallet[]> => {
  const { data } = await axiosInstance.get("/master-pallet");
  assertSuccess(data);

  // data.data bisa array atau object, handle array
  return Array.isArray(data.data)
    ? data.data.map((r: any) => ({
        id: r.id,
        organization_id: r.organization_id,
        pallet_code: r.pallet_code,
        uom_name: r.uom_name,
        capacity: r.capacity,
        isActive: r.isActive,
        isEmpty: r.isEmpty,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }))
    : [];
};

export const getPalletById = async (id: number): Promise<Pallet> => {
  const { data } = await axiosInstance.get(`/master-pallet/${id}`);
  assertSuccess(data);

  return {
    id: data.data.id,
    organization_id: data.data.organization_id,
    pallet_code: data.data.pallet_code,
    uom_name: data.data.uom_name,
    capacity: data.data.capacity,
    isActive: data.data.isActive,
    isEmpty: data.data.isEmpty,
    createdAt: data.data.createdAt,
    updatedAt: data.data.updatedAt,
  };
};

/* ---------- commands ---------- */
export const createPallet = async (payload: PalletPayload) => {
  try {
    const { data } = await axiosInstance.post("/master-pallet", payload);
    assertSuccess(data);
    return data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error || err.response.data.message);
    }
    throw err;
  }
};

export const updatePallet = async (id: number, payload: PalletPayload) => {
  try {
    const { data } = await axiosInstance.patch(`/master-pallet/${id}`, payload);
    assertSuccess(data);
    return data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error || err.response.data.message);
    }
    throw err;
  }
};

export const deletePallet = async (id: number) => {
  try {
    const { data } = await axiosInstance.delete(`/master-pallet/${id}`);
    assertSuccess(data);
    return data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error || err.response.data.message);
    }
    throw err;
  }
};
