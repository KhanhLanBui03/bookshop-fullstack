package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.*;
import com.fit.monolithic.backend.dto.response.*;

public interface ReviewService {

    /** Tạo review mới hoặc reply (parentId trong request) */
    ReviewResponse createReview(Long userId, CreateReviewRequest request);

    /** Lấy danh sách review gốc của sách (đã APPROVED, phân trang) */
    PageResponse<ReviewResponse> getBookReviews(
            Long bookId, int page, int size, Long currentUserId
    );

    /** Chỉnh sửa review (chỉ chủ review) */
    ReviewResponse updateReview(Long userId, Long reviewId, UpdateReviewRequest request);

    /** Xoá review (chỉ chủ review) */
    void deleteReview(Long userId, Long reviewId);

    /** Admin duyệt / từ chối review */
    ReviewResponse updateReviewStatus(Long reviewId, UpdateReviewStatusRequest request);

    /** Toggle helpful (bỏ nếu đã helpful rồi) */
    ReviewResponse toggleHelpful(Long userId, Long reviewId);
}