package com.fit.monolithic.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatsDashboardResponse {
    private BigDecimal revenue;
    private Long orders;
    private Long bookSold;
    private Long customers;
}
