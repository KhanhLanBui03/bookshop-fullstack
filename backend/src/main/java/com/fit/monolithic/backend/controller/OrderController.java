package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.CreateOrderRequest;
import com.fit.monolithic.backend.dto.response.OrderResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
