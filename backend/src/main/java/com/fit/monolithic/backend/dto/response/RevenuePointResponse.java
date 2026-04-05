package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data @AllArgsConstructor
public class RevenuePointResponse {
    private String     label;    // "Jan", "Mon", etc.
    private BigDecimal value;
}