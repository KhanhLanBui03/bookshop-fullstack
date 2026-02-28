package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.config.VnpayConfig;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.entity.Order;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.repository.OrderRepository;
import com.fit.monolithic.backend.service.VnpayService;
import com.fit.monolithic.backend.utils.VnpayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderRepository orderRepository;
    private final VnpayConfig config;
    private final VnpayUtil vnpayUtil;
    private final VnpayService  vnpayService;
    @GetMapping("/create-vnpay")
    public ApiResponse<String> createPayment(
            @RequestParam String orderCode,
            HttpServletRequest request) {

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow();

        String paymentUrl = vnpayService.createPaymentUrl(order, request);

        return new ApiResponse<>(200, "Success", paymentUrl);
    }
    @GetMapping("/vnpay-return")
    public ApiResponse<?> vnpayReturn(@RequestParam Map<String,String> params){

        String secureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        String signValue = vnpayUtil.hashAllFields(params, config.getHashSecret());

        if(!signValue.equals(secureHash)){
            return new ApiResponse<>(400, "Invalid signature", null);
        }

        String orderCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");

        Order order = orderRepository.findByOrderCode(orderCode).orElseThrow();

        if("00".equals(responseCode)){
            order.setOrderStatus(OrderStatus.PAID);
            order.setTransactionId(transactionNo);
        }else{
            order.setOrderStatus(OrderStatus.FAILED);
        }

        orderRepository.save(order);

        return new ApiResponse<>(200, "Payment processed", null);
    }
}
