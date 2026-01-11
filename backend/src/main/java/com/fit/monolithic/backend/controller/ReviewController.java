package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.ReviewRequest;
import com.fit.monolithic.backend.dto.response.ReviewResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Review API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/books/{bookId}")
    public ApiResponse<ReviewResponse> save(
            @PathVariable Long bookId,
            @Valid @RequestBody ReviewRequest reviewRequest
    ) {
        return new ApiResponse<>(
                201,
                "Successfully created Review",
                reviewService.save(bookId, reviewRequest)
        );
    }


}
