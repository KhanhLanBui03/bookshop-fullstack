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
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Order APIs", description = "Operations related to orders")
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    //    @PostMapping
//    public ApiResponse<OrderResponse> createOrder(
//            @RequestBody CreateOrderRequest createOrderRequest,
//            @AuthenticationPrincipal CustomUserDetails customUserDetails
//    ){
//        return new ApiResponse<>(
//                201,
//                "Success",
//                orderService.createOrder(createOrderRequest,customUserDetails)
//        );
//    }
    @PostMapping
    public ApiResponse<?> createOrder(
            @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            HttpServletRequest httpRequest
    ) {

        Object result = orderService.createOrder(request, userDetails, httpRequest);

        if (result instanceof String) {
            return new ApiResponse<>(200, "Redirect VNPay", result);
        }

        return new ApiResponse<>(200, "Order created", result);
    }

    @GetMapping("/admin/order-stats")
    public ApiResponse<OrderDashboardStats> getOrderDashboardStat() {
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
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return new ApiResponse<>(
                200,
                "Success",
                orderService.getAllOrderAdmins(keyword, orderStatus, paymentMethod, pageable)
        );
    }
    @GetMapping("/check-purchased")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Boolean> checkPurchased(
            @RequestParam Long bookId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return new ApiResponse<>(200, "Success",
                orderService.checkPurchased(userDetails.getId(), bookId));
    }
}
