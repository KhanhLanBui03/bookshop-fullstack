import axiosClient from "./axios";

export const paymentApi = {
    // Gọi sau khi VNPay redirect về frontend
    verifyVnpay(params: Record<string, string>) {
        return axiosClient.get("/payment/vnpay-verify", { params });
    }
}