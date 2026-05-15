import { discountApi } from "@/api/discount.api";
import type { DiscountResponse } from "@/types/Discount";

export const discountService = {
    async validate(code: string): Promise<DiscountResponse> {
        const res = await discountApi.validate(code);
        return res.data.data;
    }
}
