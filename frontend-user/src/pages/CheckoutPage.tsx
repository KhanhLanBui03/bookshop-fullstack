import { useEffect, useState } from "react"
import ShippingStep from "@/components/checkout/ShippingStep"
import PaymentStep from "@/components/checkout/PaymentStep"
import ReviewStep from "@/components/checkout/ReviewStep"
import StepIndicator from "@/components/checkout/StepIndicator"
import { useCartStore } from "@/store/cart.store"
import { checkoutService } from "@/services/checkout.service"
import type { CheckoutResponse } from "@/types/Checkout"
import type { CreateOrderRequest, PaymentMethod } from "@/types/Order"
import OrderConfirmation from "@/components/checkout/OrderConfirmation"
import { discountService } from "@/services/discount.service"
import { orderService } from "@/services/order.service"
import type { DiscountResponse } from "@/types/Discount"
import { toast } from "sonner"
import { ShoppingBag, Loader2 } from "lucide-react"

const steps = [
    "Vận chuyển",
    "Thanh toán",
    "Xác nhận"
]

export default function CheckoutPage() {

    const selectedIds = useCartStore(state => state.selectedCheckoutIds)
    const clearSelectedCheckoutIds = useCartStore(state => state.clearSelectedCheckoutIds)
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null)
    const [step, setStep] = useState(0)
    const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(null)
    const [selectedAddrId, setSelectedAddrId] = useState<number | null>(null)
    const [payMethod, setPayMethod] = useState<PaymentMethod | null>(null)
    const [appliedDiscount, setAppliedDiscount] = useState<DiscountResponse | null>(null)
    const [discountCode, setDiscountCode] = useState("")

    // 🔥 Gọi API prepare
    useEffect(() => {
        const fetchCheckout = async () => {
            if (!selectedIds.length) return

            try {
                const res = await checkoutService.getCheckoutInfo({
                    cartItemIds: selectedIds
                })
                setCheckoutData(res)
                // auto chọn địa chỉ đầu tiên
                if (res.customerAddresses.length > 0) {
                    setSelectedAddrId(res.customerAddresses[0].id)
                }
            } catch (error) {
                toast.error("Không thể tải thông tin thanh toán")
                console.error(error)
            }
        }

        fetchCheckout()
    }, [selectedIds])

    if (!checkoutData) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="size-12 text-primary animate-spin" />
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Đang khởi tạo thanh toán...</p>
            </div>
        )
    }

    const calculateDiscount = () => {
        if (!appliedDiscount || !checkoutData) return 0
        if (appliedDiscount.discountValueType === 'PERCENTAGE') {
            const amount = checkoutData.totalAmount * (appliedDiscount.discountValue / 100)
            return Math.min(amount, appliedDiscount.discountMaxAmount || amount)
        }
        return appliedDiscount.discountValue
    }

    const finalTotal = checkoutData ? checkoutData.totalAmount - calculateDiscount() : 0

    const handleApplyDiscount = async (code: string) => {
        try {
            const res = await discountService.validate(code)
            setAppliedDiscount(res)
            setDiscountCode(code)
            toast.success("Áp dụng mã giảm giá thành công!")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Mã giảm giá không hợp lệ")
            setAppliedDiscount(null)
            setDiscountCode("")
        }
    }

    const handleNextShipping = () => {
        if (!selectedAddrId) {
            toast.error("Vui lòng chọn địa chỉ giao hàng")
            return
        }
        setStep(1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleNextPayment = () => {
        if (!payMethod) {
            toast.error("Vui lòng chọn phương thức thanh toán")
            return
        }
        setStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePlaceOrder = async () => {
        if (!selectedAddrId || !payMethod) return

        const orderPayload: CreateOrderRequest = {
            addressId: selectedAddrId,
            paymentMethod: payMethod,
            cartItemIds: selectedIds,
            discountCode: appliedDiscount?.code
        }

        const loadingToast = toast.loading("Đang xử lý đơn hàng...")

        try {
            const orderRes = await orderService.createOrder(orderPayload)
            clearSelectedCheckoutIds()
            
            // 🔥 Refresh giỏ hàng sau khi đặt thành công
            await useCartStore.getState().fetchCart()

            toast.dismiss(loadingToast)

            // ✅ VNPAY → redirect sang cổng thanh toán
            if (typeof orderRes === 'string') {
                window.location.href = orderRes
                return
            }

            // COD / BANK → hiển thị confirmation
            setCreatedOrderId(orderRes.id)
            toast.success("Đặt hàng thành công!")

        } catch (err) {
            toast.dismiss(loadingToast)
            toast.error("Đặt hàng thất bại, vui lòng thử lại")
            console.error(err)
        }
    }

    if (createdOrderId) {
        return (
            <OrderConfirmation
                orderId={createdOrderId}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background pt-12 pb-24">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="size-16 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mb-6">
                        <ShoppingBag className="size-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2 uppercase">Thanh toán</h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em]">Hoàn tất bước cuối cùng để sở hữu sách</p>
                </div>

                <StepIndicator current={step} steps={steps} />

                <div className="mt-12">
                    {step === 0 && (
                        <ShippingStep
                            data={checkoutData}
                            selectedAddrId={selectedAddrId}
                            onSelectAddr={setSelectedAddrId}
                            onNext={handleNextShipping}
                        />
                    )}

                    {step === 1 && (
                        <PaymentStep
                            method={payMethod}
                            setMethod={setPayMethod}
                            total={finalTotal}
                            onBack={() => setStep(0)}
                            onNext={handleNextPayment}
                        />
                    )}

                    {step === 2 && (
                        <ReviewStep
                            shipping={
                                checkoutData.customerAddresses.find(a => a.id === selectedAddrId)!
                            }
                            method={payMethod!}
                            items={checkoutData.items}
                            total={checkoutData.totalAmount}
                            discountAmount={calculateDiscount()}
                            finalTotal={finalTotal}
                            onApplyDiscount={handleApplyDiscount}
                            onBack={() => setStep(1)}
                            onPlaceOrder={handlePlaceOrder}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}