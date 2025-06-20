import axiosInstance from "../AxiosInstance";

export interface IO {
  id: string;
  organization_id: number;
  organization_name: string;
  operating_unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIOPayload {
  organization_id: number;
  organization_name: string;
  operating_unit: string;
}

export interface UpdateIOPayload {
  organization_id?: number;
  organization_name?: string;
  operating_unit?: string;
}

interface IOResponse {
  success: boolean;
  message: string;
  error?: string;
  data: IO | IO[];
}

// ✅ Pure functions: return result or throw
export const fetchIO = async (): Promise<IO[]> => {
  const res = await axiosInstance.get<IOResponse>("/master-io");
  if (!res.data.success) throw new Error(res.data.error || res.data.message);
  return res.data.data as IO[];
};

export const fetchIOById = async (id: string): Promise<IO> => {
  const res = await axiosInstance.get<IOResponse>(`/master-io/${id}`);
  if (!res.data.success) throw new Error(res.data.error || res.data.message);
  const data = res.data.data;
  return Array.isArray(data) ? data[0] : data;
};

export const createIO = async (payload: CreateIOPayload): Promise<IO> => {
  const res = await axiosInstance.post<IOResponse>("/master-io", payload);
  if (!res.data.success) {
    const err = new Error(res.data.error || res.data.message);
    (err as any).response = { data: res.data }; // simulate Axios error structure
    throw err;
  }
  const data = res.data.data;
  return Array.isArray(data) ? data[0] : data;
};

export const updateIO = async (
  id: string,
  payload: UpdateIOPayload
): Promise<IO> => {
  const res = await axiosInstance.patch<IOResponse>(
    `/master-io/${id}`,
    payload
  );
  if (!res.data.success) throw new Error(res.data.error || res.data.message);
  const data = res.data.data;
  return Array.isArray(data) ? data[0] : data;
};

export const deleteIO = async (id: string): Promise<void> => {
  const res = await axiosInstance.delete<IOResponse>(`/master-io/${id}`);
  if (!res.data.success) throw new Error(res.data.error || res.data.message);
};
