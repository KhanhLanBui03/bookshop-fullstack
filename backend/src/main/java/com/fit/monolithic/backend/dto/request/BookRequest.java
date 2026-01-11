package com.fit.monolithic.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookRequest {
    private String title;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private String description;
    private BigDecimal rating;
    private Integer stock;
    private Long categoryId;
    private Long authorId;
    private Long publisherId;
    private List<ImageRequest> images = new ArrayList<>();

}
