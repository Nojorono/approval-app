import axiosInstance from "./AxiosInstance";

interface BaseResponse<T> {
    success: boolean;
    message: string;
    error?: string;
    data: T;
}

const handleResponse = <T,>(response: { data: BaseResponse<T> }): T => {
    if (response.data.success) return response.data.data;
    throw new Error(response.data.error || response.data.message);
};

export const createCrudService = <TData, TCreate, TUpdate>(
    baseUrl: string
) => ({
    fetchAll: async (): Promise<TData[]> => {
        const res = await axiosInstance.get<BaseResponse<TData[]>>(baseUrl);
        return handleResponse(res);
    },

    fetchById: async (id: number): Promise<TData> => {
        const res = await axiosInstance.get<BaseResponse<TData>>(`${baseUrl}/${id}`);
        return handleResponse(res);
    },

    create: async (payload: TCreate): Promise<TData> => {
        const res = await axiosInstance.post<BaseResponse<TData>>(baseUrl, payload);
        return handleResponse(res);
    },

    update: async (id: number, payload: TUpdate): Promise<TData> => {
        const res = await axiosInstance.patch<BaseResponse<TData>>(
            `${baseUrl}/${id}`,
            payload
        );
        return handleResponse(res);
    },

    delete: async (id: number): Promise<boolean> => {
        const res = await axiosInstance.delete<{ success: boolean; message: string }>(
            `${baseUrl}/${id}`
        );
        if (res.data.success) return true;
        throw new Error(res.data.message);
    },
});
