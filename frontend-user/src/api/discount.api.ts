import axiosClient from "./axios";

export const discountApi = {
    validate(code: string) {
        return axiosClient.get(`/discounts/validate`, { params: { code } });
    }
}
