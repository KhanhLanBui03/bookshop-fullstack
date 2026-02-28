import { addressApi } from "@/api/address.api"
import type { AddressResponse, CreateAddressRequest } from "@/types/Address"

 

export const addressService = {
    async createAddress(form: CreateAddressRequest):Promise<AddressResponse> {
        const res = await addressApi.createAddress(form)
        return res.data.data as AddressResponse
    }
}