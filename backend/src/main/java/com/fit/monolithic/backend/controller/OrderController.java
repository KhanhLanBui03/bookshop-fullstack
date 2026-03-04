package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.CreateOrderRequest;
import com.fit.monolithic.backend.dto.response.OrderAdminResponse;
import com.fit.monolithic.backend.dto.response.OrderDashboardStats;
import com.fit.monolithic.backend.dto.response.OrderResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.enums.PaymentMethod;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    @PostMapping
    public ApiResponse<OrderResponse> createOrder(
            @RequestBody CreateOrderRequest createOrderRequest,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ){
        return new ApiResponse<>(
                201,
                "Success",
                orderService.createOrder(createOrderRequest,customUserDetails)
        );
    }
    @GetMapping("/admin/order-stats")
    public ApiResponse<OrderDashboardStats>  getOrderDashboardStat(){
        return new ApiResponse<>(
                200,
                "Success",
                orderService.getOrderDashboardStat()
        );
    }
    @GetMapping("/admin/order-admin")
    public ApiResponse<Page<OrderAdminResponse>> getAllOrderAdmins(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(required = false)PaymentMethod paymentMethod,
            @PageableDefault(size = 10) Pageable pageable
            ){
        return new ApiResponse<>(
                200,
                "Success",
                orderService.getAllOrderAdmins(keyword, orderStatus, paymentMethod, pageable)
        );
    }
}
