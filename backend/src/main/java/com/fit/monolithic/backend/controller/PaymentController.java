package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.config.VnpayConfig;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.Order;
import com.fit.monolithic.backend.entity.OrderItem;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.repository.OrderRepository;
import com.fit.monolithic.backend.service.VnpayService;
import com.fit.monolithic.backend.service.InventoryService;
import com.fit.monolithic.backend.utils.VnpayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderRepository orderRepository;
    private final VnpayConfig config;
    private final VnpayUtil vnpayUtil;
    private final VnpayService vnpayService;
    private final InventoryService inventoryService;

    @GetMapping("/create-vnpay")
    public ApiResponse<String> createPayment(
            @RequestParam String orderCode,
            HttpServletRequest request) {

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String paymentUrl = vnpayService.createPaymentUrl(order, request);
        return new ApiResponse<>(200, "Success", paymentUrl);
    }

    // ✅ Endpoint này frontend gọi sau khi VNPay redirect về
    @GetMapping("/vnpay-verify")
    public ApiResponse<?> vnpayVerify(@RequestParam Map<String, String> params) {

        String secureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> sortedParams = new TreeMap<>(params);
        String signValue = vnpayUtil.hashAllFields(sortedParams, config.getHashSecret());

        if (!signValue.equals(secureHash)) {
            return new ApiResponse<>(400, "Invalid signature", null);
        }

        String orderCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("00".equals(responseCode)) {
            order.setOrderStatus(OrderStatus.PAID);
        } else {
            order.setOrderStatus(OrderStatus.FAILED);
            // ✅ Hoàn kho khi thanh toán thất bại bằng InventoryService để có log
            for (OrderItem item : order.getOrderItems()) {
                Book book = item.getBook();
                if (book != null) {
                    inventoryService.updateStock(book.getId(), item.getQuantity(), "CANCELLED_PAYMENT");
                }
            }
        }

        orderRepository.save(order);

        return new ApiResponse<>(200, "Payment processed", Map.of(
                "success", "00".equals(responseCode),
                "orderId", order.getId(),
                "orderCode", order.getOrderCode()
        ));
    }
}
