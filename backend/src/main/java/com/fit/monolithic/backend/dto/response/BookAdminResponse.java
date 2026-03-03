package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.enums.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookAdminResponse {
    private Long id;
    private String title;
    private String publisher;
    private String author;
    private String images;
    private String category;
    private BigDecimal salePrice;
    private Integer stock;
    private Integer soldCount;
    private BigDecimal rating;
    private BookStatus status;
}
