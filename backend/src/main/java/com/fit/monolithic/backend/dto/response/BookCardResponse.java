package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookCardResponse {
    private Long id;
    private String title;
    private BigDecimal salePrice;
    private BigDecimal originalPrice;
    private BigDecimal rating;
    private Integer soldCount;
    private String image;
    private String authorName;
}
