package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.CreateOrderRequest;
import com.fit.monolithic.backend.dto.response.OrderResponse;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request, CustomUserDetails customUserDetails);
}
