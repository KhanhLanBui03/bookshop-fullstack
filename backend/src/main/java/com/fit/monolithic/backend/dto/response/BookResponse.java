package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.dto.request.ImageRequest;
import com.fit.monolithic.backend.dto.request.PublisherRequest;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookResponse {

    private Long id;
    private String title;
    private String description;

    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private BigDecimal rating;

    private Integer stock;
    private Integer soldCount;
    private String categoryName;
    private String authorName;

    private PublisherResponse publisher;
    private List<ImageResponse> images;

    private LocalDateTime createdAt;
}
