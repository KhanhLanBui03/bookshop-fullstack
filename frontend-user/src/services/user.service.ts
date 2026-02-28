import { userApi } from "@/api/user.api"
import type { ProfileResponse } from "@/types/User"

export const userService = {
    async getProfile():Promise<ProfileResponse> {
        const res = await userApi.getProfile()
        return res.data.data as ProfileResponse
    }
}