import axiosInstance from "../AxiosInstance";

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
  error?: string;
  data: Uom | Uom[];
}

const handleResponse = <T,>(response: { data: UomResponse }): T => {
  if (response.data.success) return response.data.data as T;
  throw new Error(response.data.error || response.data.message);
};

export const fetchUOM = async (): Promise<Uom[]> => {
  const res = await axiosInstance.get<UomResponse>("/master-uom");
  if (!res.data.success) throw new Error(res.data.error || res.data.message);
  return res.data.data as Uom[];
};

export const fetchUomById = async (id: number): Promise<Uom> => {
  const res = await axiosInstance.get<UomResponse>(`/master-uom/${id}`);
  return handleResponse<Uom>(res);
};

export const createUom = async (payload: CreateUomPayload): Promise<Uom> => {
  const res = await axiosInstance.post<UomResponse>("/master-uom", payload);
  if (!res.data.success) {
    throw new Error(res.data.error || res.data.message);
  }
  const data = res.data.data;
  return Array.isArray(data) ? data[0] : data;
};

export const updateUom = async (
  id: number,
  payload: UpdateUomPayload
): Promise<Uom> => {

  console.log("Updating UOM with ID:", id, "and payload:", payload);
  

  const res = await axiosInstance.patch<UomResponse>(
    `/master-uom/${id}`,
    payload
  );
  return handleResponse<Uom>(res);
};

export const deleteUom = async (id: number): Promise<boolean> => {
  const res = await axiosInstance.delete<{
    success: boolean;
    message: string;
  }>(`/master-uom/${id}`);
  if (res.data.success) return true;
  throw new Error(res.data.message);
};
