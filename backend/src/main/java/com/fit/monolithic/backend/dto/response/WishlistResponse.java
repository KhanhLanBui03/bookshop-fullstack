package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class WishlistResponse {

    private Long wishlistId;
    private Long userId;
    private List<WishlistItemResponse> items = new ArrayList<>();
}
