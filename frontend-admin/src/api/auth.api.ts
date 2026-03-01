import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from "@/types/Account";
import axiosClient from "./axios";

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await axiosClient.post<any>('/auth/login', data);
        return response.data.data;
    },
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await axiosClient.post<any>('/auth/register', data);
        return response.data.data;
    },
    logout: async (token: string): Promise<void> => {
        await axiosClient.delete('/auth/logout', {
            params: { token }
        });
    },
    getCurrentUser: async (): Promise<User> => {
        const response = await axiosClient.get<any>('/auth/me');
        return response.data.data;
    },
    refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
        const response = await axiosClient.post<any>('/auth/refresh-token', { refreshToken });
        return response.data.data;
    },
}