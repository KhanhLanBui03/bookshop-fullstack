package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.entity.Order;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface VnpayService {
    String createPaymentUrl(Order order, HttpServletRequest request);
    String buildQueryUrl(Map<String, String> params);
}
