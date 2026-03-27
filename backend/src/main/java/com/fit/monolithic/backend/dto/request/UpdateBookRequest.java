package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateBookRequest {

    private String title;
    private String description;

    private BigDecimal salePrice;
    private Integer stock;

    private Long categoryId;
    private Long authorId;
    private Long publisherId;

    private List<ImageRequest> images;

    private BookStatus status;
}