package com.fit.monolithic.backend.enums;

public enum OrderStatus {
    PENDING,           // mới tạo
    WAITING_PAYMENT,   // đã tạo link Sepay
    PAID,              // thanh toán thành công
    FAILED,
    CANCELLED,
    CREATED
}
