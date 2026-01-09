package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WishlistItemResponse {

    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookImage;   // optional
    private Double salePrice;   // optional
}