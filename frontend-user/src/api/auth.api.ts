import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/Account";
import axiosClient from "./axios";

export const authApi = {
    login: async (data: LoginRequest):Promise<LoginResponse> => {
        const response = await axiosClient.post<LoginResponse>('/auth/login',data);
        return response.data;
    },
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await axiosClient.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },
    logout: async (): Promise<void> => {
        await axiosClient.delete('/auth/logout');
    },
    getCurrentUser: async () => {
        const response = await axiosClient.get('/auth/me');
        return response.data;
    },
    refreshToken: async (refreshToken: string) => {
        const response = await axiosClient.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },
}