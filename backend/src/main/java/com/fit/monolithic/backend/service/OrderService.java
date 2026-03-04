package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.CreateOrderRequest;
import com.fit.monolithic.backend.dto.response.OrderAdminResponse;
import com.fit.monolithic.backend.dto.response.OrderDashboardStats;
import com.fit.monolithic.backend.dto.response.OrderResponse;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.enums.PaymentMethod;
import com.fit.monolithic.backend.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request, CustomUserDetails customUserDetails);
    OrderDashboardStats getOrderDashboardStat();
    Page<OrderAdminResponse> getAllOrderAdmins(String keyword, OrderStatus orderStatus, PaymentMethod paymentMethod, Pageable pageable);
}
