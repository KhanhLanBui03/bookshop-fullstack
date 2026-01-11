package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.ReviewRequest;
import com.fit.monolithic.backend.dto.response.ReviewResponse;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    ReviewResponse save(Long bookId,ReviewRequest reviewRequest);
    List<ReviewResponse> getAllByBook(Long bookId);
}
