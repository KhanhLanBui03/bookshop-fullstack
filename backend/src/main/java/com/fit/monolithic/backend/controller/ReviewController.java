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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepo;
    /** GET /api/reviews/book/{bookId}?page=0&size=10 */
    @GetMapping("/book/{bookId}")
    public ResponseEntity<PageResponse<ReviewResponse>> getBookReviews(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = extractId(userDetails);
        return ResponseEntity.ok(
                reviewService.getBookReviews(bookId, page, size, userId));
    }

    /** POST /api/reviews  (review gốc hoặc reply nếu có parentId) */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody CreateReviewRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = extractId(userDetails);
        ReviewResponse res = reviewService.createReview(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    /** PUT /api/reviews/{id} */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                reviewService.updateReview(extractId(userDetails), id, req));
    }

    /** DELETE /api/reviews/{id} */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.deleteReview(extractId(userDetails), id);
        return ResponseEntity.noContent().build();
    }

    /** PATCH /api/reviews/{id}/status  (admin) */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewStatusRequest req
    ) {
        return ResponseEntity.ok(reviewService.updateReviewStatus(id, req));
    }

    /** POST /api/reviews/{id}/helpful */
    @PostMapping("/{id}/helpful")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> toggleHelpful(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                reviewService.toggleHelpful(extractId(userDetails), id));
    }

    private Long extractId(UserDetails ud) {
        if (ud instanceof CustomUserDetails cud) return cud.getId();
        throw new IllegalStateException("Cannot extract user id from principal");
    }
    @GetMapping("/check-reviewed")
    public ApiResponse<Boolean> checkReviewed(
            @RequestParam Long userId,
            @RequestParam Long bookId
    ) {
        boolean result = reviewRepo.existsByUserIdAndBookIdAndParentIsNull(userId, bookId);
        return new ApiResponse<>(200, "Success", result);
    }
}