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
public class TopBookResponse {
    private Long id;
    private String title;
    private String authorName;
    private BigDecimal rating;
    private Integer sold;
    private Integer stock;
}
