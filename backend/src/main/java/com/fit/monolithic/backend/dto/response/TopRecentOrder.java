package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.enums.OrderStatus;
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
public class TopRecentOrder {
    private Long id;
    private String fullName;
    private LocalDate orderDate;
    private OrderStatus orderStatus;
    private BigDecimal orderTotalAmount;
}
