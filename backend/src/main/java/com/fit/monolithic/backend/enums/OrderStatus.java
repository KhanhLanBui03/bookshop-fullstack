package com.fit.monolithic.backend.enums;

public enum OrderStatus {
    PENDING_PAYMENT,   // tạo order xong, chưa thanh toán
    PAID,              // đã thanh toán thành công
    FAILED,            // thanh toán lỗi
    CREATED,           // COD
    SHIPPING,
    COMPLETED,
    CANCELLED
}
