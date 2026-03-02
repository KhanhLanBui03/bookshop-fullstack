package com.fit.monolithic.backend.enums;

public enum OrderStatus {// tạo order xong, chưa thanh toán
    PAID,              // đã thanh toán thành công
    FAILED,            // thanh toán lỗi
    CREATED,           // COD
    SHIPPING,
    COMPLETED,
    CANCELLED
}
