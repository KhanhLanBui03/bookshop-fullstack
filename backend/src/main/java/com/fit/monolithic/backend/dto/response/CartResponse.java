package com.fit.monolithic.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;
    private Integer totalItems;
}