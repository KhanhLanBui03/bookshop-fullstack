package com.fit.monolithic.backend.enums;

public enum OrderStatus {
    PENDING,      // vừa tạo
    CONFIRMED,    // admin xác nhận
    SHIPPING,     // đang giao
    DELIVERED,    // đã giao
    CANCELLED,
    REFUNDED
}