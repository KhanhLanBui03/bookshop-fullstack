export type DiscountTargetType = 'ALL_ORDER' | 'SPECIFIC_BOOK' | 'CATEGORY'
export type DiscountValueType = 'PERCENTAGE' | 'FIXED_AMOUNT'

export interface DiscountResponse {
    id: number
    name: string
    code: string
    discountTargetType: DiscountTargetType
    discountValueType: DiscountValueType
    discountValue: number
    discountMaxAmount: number
    discountStartDate: string
    discountEndDate: string
    discountQuantityLimit: number
    discountActive: boolean
}
