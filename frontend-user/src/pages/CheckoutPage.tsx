import { useEffect, useState } from "react"
import ShippingStep from "@/components/checkout/ShippingStep"
import PaymentStep from "@/components/checkout/PaymentStep"
import ReviewStep from "@/components/checkout/ReviewStep"
import StepIndicator from "@/components/checkout/StepIndicator"
import { useCartStore } from "@/store/cart.store"
import { checkoutService } from "@/services/checkout.service"
import type { CheckoutResponse } from "@/types/Checkout"
import { orderService } from "@/services/order.service"
import type { CreateOrderRequest, PaymentMethod } from "@/types/Order"
import OrderConfirmation from "@/components/checkout/OrderConfirmation"

const steps = [
    "Thông tin giao hàng",
    "Thanh toán",
    "Xác nhận đơn hàng"
]

export default function CheckoutPage() {

    const selectedIds = useCartStore(state => state.selectedCheckoutIds)
    const clearSelectedCheckoutIds = useCartStore(state => state.clearSelectedCheckoutIds)
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null)
    const [step, setStep] = useState(0)
    const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(null)
    const [selectedAddrId, setSelectedAddrId] = useState<number | null>(null)
    const [payMethod, setPayMethod] = useState<PaymentMethod | null>(null)

    // 🔥 Gọi API prepare
    useEffect(() => {
        const fetchCheckout = async () => {
            if (!selectedIds.length) return

            const res = await checkoutService.getCheckoutInfo({
                cartItemIds: selectedIds
            })

            setCheckoutData(res)

            // auto chọn địa chỉ đầu tiên
            if (res.customerAddresses.length > 0) {
                setSelectedAddrId(res.customerAddresses[0].id)
            }
        }

        fetchCheckout()
    }, [selectedIds])

    if (!checkoutData) {
        return <div className="p-8">Đang tải checkout...</div>
    }

    const total = checkoutData.totalAmount

    const handleNextShipping = () => {
        if (!selectedAddrId) {
            alert("Vui lòng chọn địa chỉ giao hàng")
            return
        }
        setStep(1)
    }

    const handleNextPayment = () => {
        if (!payMethod) {
            alert("Vui lòng chọn phương thức thanh toán")
            return
        }
        setStep(2)
    }

    const handlePlaceOrder = async () => {
        if (!selectedAddrId || !payMethod) return

        const orderPayload: CreateOrderRequest = {
            addressId: selectedAddrId,
            paymentMethod: payMethod,
            cartItemIds: selectedIds
        }

        try {
            const orderRes = await orderService.createOrder(orderPayload)
            clearSelectedCheckoutIds()

            // ✅ VNPAY → redirect sang cổng thanh toán
            if (typeof orderRes === 'string') {
                window.location.href = orderRes
                return
            }

            // COD / BANK → hiển thị confirmation
            setCreatedOrderId(orderRes.id)

        } catch (err) {
            alert("Đặt hàng thất bại, vui lòng thử lại")
            console.error(err)
        }
    }
    if (createdOrderId) {
        return (
            <OrderConfirmation
                orderId={createdOrderId}
                onBackHome={() => {
                    setCreatedOrderId(null)
                    setStep(0)
                }}
            />
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <StepIndicator current={step} steps={steps} />

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
                    total={total}
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
                    onBack={() => setStep(1)}
                    onPlaceOrder={handlePlaceOrder}
                />
            )}
        </div>
    )
}