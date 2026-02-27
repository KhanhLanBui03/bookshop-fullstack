package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutItemResponse {
    private Long bookId;
    private String bookName;
    private String image;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}
