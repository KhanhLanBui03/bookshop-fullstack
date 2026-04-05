package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class AnalyticsKpiResponse {
    private Double  conversionRate;        // %  (purchased / visitors * 100)
    private BigDecimal avgOrderValue;      // avg of DELIVERED orders
    private Double  returnRate;            // % orders that were REFUNDED
    private Long    newUsers;              // registered this period
    private Long    returningUsers;        // placed >1 order
}