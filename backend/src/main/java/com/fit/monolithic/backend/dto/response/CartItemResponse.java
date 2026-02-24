package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CartItemResponse {
    private Long bookId;
    private String title;
    private String image;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
}
