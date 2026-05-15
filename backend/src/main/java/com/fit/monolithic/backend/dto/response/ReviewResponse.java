package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.enums.CommentStatus;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String content;
    private Integer rating;
    private CommentStatus status;
    private String createdAt;
    private ReviewUserResponse user;
    private Long parentId;
    private List<ReviewResponse> replies;
    private int helpfulCount;
    private boolean helpful;     // đã helpful chưa (current user)
    private List<String> imageUrls;
    private Long bookId;
}