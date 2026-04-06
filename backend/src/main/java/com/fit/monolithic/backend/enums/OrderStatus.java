package com.fit.monolithic.backend.enums;

public enum OrderStatus {
    PENDING_PAYMENT, // 🔥 chờ thanh toán (VNPay)
    PAID,            // 🔥 đã thanh toán

    PENDING,         // COD: vừa tạo
    CONFIRMED,       // admin xác nhận
    SHIPPING,
    DELIVERED,
    FAILED,          // 🔥 thanh toán thất bại
    CANCELLED,
    REFUNDED
}