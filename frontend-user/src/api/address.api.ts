import type { AddressResponse, CreateAddressRequest } from "@/types/Address"
import axiosClient from "./axios"

export const addressApi = {
    createAddress(data: CreateAddressRequest) {
        return axiosClient.post<AddressResponse>('/addresses', data)
    }
}