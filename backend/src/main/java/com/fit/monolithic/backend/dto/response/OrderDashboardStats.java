package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDashboardStats {
    private BigDecimal totalRevenue;
    private Long totalPending;
    private Long totalDelivered;
    private Long totalShipping;
}
