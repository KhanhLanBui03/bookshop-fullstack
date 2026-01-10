package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReviewResponse {
    private Long id;

    private Long bookId;

    private Long userId;

    private String userName;

    private String content;

    private Integer rating;

    private LocalDateTime createdAt;

}
