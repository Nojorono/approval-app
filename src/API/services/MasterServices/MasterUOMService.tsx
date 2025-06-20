import axiosInstance from "../AxiosInstance";
import { showErrorToast } from "../../../components/toast";

export interface Uom {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUomPayload {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface UpdateUomPayload {
  code?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

interface UomResponse {
  success: boolean;
  message: string;
  data: Uom;
}

const handleResponse = <T,>(response: { data: UomResponse }): T | null => {
  if (response.data.success) return response.data.data as T;
  showErrorToast(response.data.message);
  return null;
};

const handleError = (error: any, fallbackMsg: string) => {
  showErrorToast(error?.response?.data?.message || fallbackMsg);
  return null;
};

export const fetchUom = async (): Promise<Uom | null> => {
  try {
    const res = await axiosInstance.get<UomResponse>("/master-uom");
    return handleResponse<Uom>(res);
  } catch (e) {
    return handleError(e, "Failed to fetch UOM data");
  }
};

export const fetchUomById = async (id: number): Promise<Uom | null> => {
  try {
    const res = await axiosInstance.get<UomResponse>(`/master-uom/${id}`);
    return handleResponse<Uom>(res);
  } catch (e) {
    return handleError(e, "Failed to fetch UOM by id");
  }
};

export const createUom = async (
  payload: CreateUomPayload
): Promise<Uom | null> => {
  try {
    const res = await axiosInstance.post<UomResponse>("/master-uom", payload);
    return handleResponse<Uom>(res);
  } catch (e) {
    return handleError(e, "Failed to create UOM");
  }
};

export const updateUom = async (
  id: number,
  payload: UpdateUomPayload
): Promise<Uom | null> => {
  try {
    const res = await axiosInstance.patch<UomResponse>(
      `/master-uom/${id}`,
      payload
    );
    return handleResponse<Uom>(res);
  } catch (e) {
    return handleError(e, "Failed to update UOM");
  }
};

export const deleteUom = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/master-uom/${id}`);
    if (res.data.success) return true;
    showErrorToast(res.data.message);
    return false;
  } catch (e: any) {
    showErrorToast(e?.response?.data?.message || "Failed to delete UOM");
    return false;
  }
};
