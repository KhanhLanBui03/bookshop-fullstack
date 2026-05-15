package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryStatsResponse {
    private Long totalCategories;
    private Long totalBooks;
    private Double avgBooksPerCategory;
    private Long emptyCategories;
    private String mostPopularCategory;
}
