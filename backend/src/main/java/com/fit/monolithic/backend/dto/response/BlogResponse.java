package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogResponse {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String thumbnail;
    private String summary;
    private boolean published;
    private String authorName;
    private LocalDateTime createdAt;
}
