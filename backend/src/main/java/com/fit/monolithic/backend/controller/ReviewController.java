package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.*;
import com.fit.monolithic.backend.dto.response.*;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.repository.ReviewRepository;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews") // ✅ FIX: thêm v1 cho đúng với frontend
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepo;

    /** GET /api/v1/reviews/book/{bookId}?page=0&size=10 */
    @GetMapping("/book/{bookId}")
    public ResponseEntity<PageResponse<ReviewResponse>> getBookReviews(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(
                reviewService.getBookReviews(bookId, page, size, userId)
        );
    }

    /** POST /api/v1/reviews */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody CreateReviewRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        ReviewResponse res = reviewService.createReview(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    /** PUT /api/v1/reviews/{id} */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                reviewService.updateReview(userDetails.getId(), id, req)
        );
    }

    /** DELETE /api/v1/reviews/{id} */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.deleteReview(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }

    /** PATCH /api/v1/reviews/{id}/status (admin) */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewStatusRequest req
    ) {
        return ResponseEntity.ok(reviewService.updateReviewStatus(id, req));
    }

    /** POST /api/v1/reviews/{id}/helpful */
    @PostMapping("/{id}/helpful")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> toggleHelpful(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                reviewService.toggleHelpful(userDetails.getId(), id)
        );
    }

    /** ✅ FIXED: không cần userId nữa */
    /** GET /api/v1/reviews/check-reviewed?bookId=2 */
    @GetMapping("/check-reviewed")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Boolean> checkReviewed(
            @RequestParam Long bookId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();

        boolean result = reviewRepo
                .existsByUserIdAndBookIdAndParentIsNull(userId, bookId);

        return new ApiResponse<>(200, "Success", result);
    }
}