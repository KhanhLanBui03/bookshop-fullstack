package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserDashboardStats {
    private Long totalCustomers;
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long newThisMonth;
}
