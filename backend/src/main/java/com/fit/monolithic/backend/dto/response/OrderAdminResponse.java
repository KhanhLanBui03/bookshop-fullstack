package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderAdminResponse {
    private Long id;
    private String orderCode;
    private String customerName;
    private String customerEmail;
    private Long countItem;
    private PaymentMethod  paymentMethod;
    private BigDecimal orderTotalAmount;
    private OrderStatus orderStatus;
    private LocalDate orderDate;
}
