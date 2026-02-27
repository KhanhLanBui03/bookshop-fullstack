package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private PaymentMethod paymentMethod;
    private String orderCode;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDate createdAt;
}
